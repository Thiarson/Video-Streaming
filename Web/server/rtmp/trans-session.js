const fs = require('node:fs');
const EventEmitter = require('node:events');
const { spawn } = require('node:child_process');
const dateFormat = require('dateformat');
const mkdirp = require('mkdirp');

const Logger = require('./core-logger');

const isHlsFile = (filename) => filename.endsWith('.ts') || filename.endsWith('.m3u8')
const isTemFiles = (filename) => filename.endsWith('.tmp')
const isDashFile = (filename) => filename.endsWith('.mpd') || filename.endsWith('.m4s')

class TransSession extends EventEmitter {
  constructor(conf) {
    super();
    this.conf = conf;
    this.getConfig = (key = null) => {
      if (!key) return
      if (typeof this.conf != 'object') return
      if (this.conf.args && typeof this.conf.args === 'object' && this.conf.args[key]) return this.conf.args[key]
      return this.conf[key]
    }
  }

  async run() {
    let vc = this.conf.vc || 'copy';
    let ac = this.conf.ac || 'copy';
    let inPath = 'rtmp://127.0.0.1:' + this.conf.rtmpPort + this.conf.streamPath;
    // let ouPath = `${this.conf.mediaroot}/${this.conf.streamApp}/${this.conf.streamName}`;
    let ouPath = this.conf.mediaroot
    let mapStr = '';

    if (this.conf.rtmp && this.conf.rtmpApp) {
      if (this.conf.rtmpApp === this.conf.streamApp) {
        Logger.error('[Transmuxing RTMP] Cannot output to the same app.');
      } else {
        let rtmpOutput = `rtmp://127.0.0.1:${this.conf.rtmpPort}/${this.conf.rtmpApp}/${this.conf.streamName}`;
        mapStr += `[f=flv]${rtmpOutput}|`;
        Logger.log('[Transmuxing RTMP] ' + this.conf.streamPath + ' to ' + rtmpOutput);
      }
    }
    if (this.conf.mp4) {
      this.conf.mp4Flags = this.conf.mp4Flags ? this.conf.mp4Flags : '';
      let mp4FileName = dateFormat('yyyy-mm-dd-HH-MM-ss') + '.mp4';
      let mapMp4 = `${this.conf.mp4Flags}${ouPath}/${mp4FileName}|`;
      mapStr += mapMp4;
      Logger.log('[Transmuxing MP4] ' + this.conf.streamPath + ' to ' + ouPath + '/' + mp4FileName);
    }
    if (this.conf.hls) {
      this.conf.hlsFlags = this.getConfig('hlsFlags') || '';
      let hlsFileName = 'index.m3u8';
      let mapHls = `${this.conf.hlsFlags}${ouPath}/${hlsFileName}|`;
      mapStr += mapHls;
      Logger.log('[Transmuxing HLS] ' + this.conf.streamPath + ' to ' + ouPath + '/' + hlsFileName);
    }
    if (this.conf.dash) {
      this.conf.dashFlags = this.conf.dashFlags ? this.conf.dashFlags : '';
      let dashFileName = 'index.mpd';
      let mapDash = `${this.conf.dashFlags}${ouPath}/${dashFileName}`;
      mapStr += mapDash;
      Logger.log('[Transmuxing DASH] ' + this.conf.streamPath + ' to ' + ouPath + '/' + dashFileName);
    }

    mkdirp.sync(ouPath);
    // Pour éviter que le lecteur ne trouve pas index.m3u8
    fs.appendFileSync(`${ouPath}/index.m3u8`, "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:11\n#EXT-X-MEDIA-SEQUENCE:0\n")

    let argv = ['-y', '-i', inPath];
    Array.prototype.push.apply(argv, ['-c:v', vc]);
    Array.prototype.push.apply(argv, this.conf.vcParam);
    Array.prototype.push.apply(argv, ['-c:a', ac]);
    Array.prototype.push.apply(argv, this.conf.acParam);
    Array.prototype.push.apply(argv, ['-f', 'tee', '-map', '0:a?', '-map', '0:v?', mapStr]);
    argv = argv.filter((n) => { return n; }); //去空

    // Démarrer la progression de la vidéo dans la base de données
    await globalThis.prisma.directContent.update({
      where: { directKey: this.conf.streamName },
      data: { directInProgress: true },
    })
    
    this.ffmpeg_exec = spawn(this.conf.ffmpeg, argv);
    this.ffmpeg_exec.on('error', (e) => {
      Logger.ffdebug(e);
    });

    this.ffmpeg_exec.stdout.on('data', (data) => {
      Logger.ffdebug(`FF_LOG:${data}`);
    });

    this.ffmpeg_exec.stderr.on('data', (data) => {
      Logger.ffdebug(`FF_LOG:${data}`);
    });

    this.ffmpeg_exec.on('close', async (code) => {
      Logger.log('[Transmuxing end] ' + this.conf.streamPath);
      this.emit('end');
      // this.cleanTempFiles(ouPath)
      // this.deleteHlsFiles(ouPath)

      // Generate VOD manifest
      this.generateManifest(ouPath)

      // Attendre 10s avant de supprimer les fichiers
      setTimeout(() => {
        this.cleanTempFiles(ouPath)
      }, 10000);

      // Arrêter la progression de la vidéo dans la base de données
      await globalThis.prisma.directContent.update({
        where: { directKey: this.conf.streamName },
        data: { directInProgress: false },
      })

      // Ajouter dans la base de données l'url de la rédiffusion
      const url = `/streams/${this.conf.userId}/direct/${this.conf.directId}/index.m3u8`

      await globalThis.prisma.rediffusionContent.create({
        data: {
          rediffusionId: this.conf.directId,
          rediffusionUrl: url,
        }
      })
    });
  }

  end() {
    this.ffmpeg_exec.kill();
  }

  // delete hls files
  deleteHlsFiles (ouPath) {
    if ((!ouPath && !this.conf.hls) || this.getConfig('hlsKeep')) return
    fs.readdir(ouPath, function (err, files) {
      if (err) return
      files.filter((filename) => isHlsFile(filename)).forEach((filename) => {
        fs.unlinkSync(`${ouPath}/${filename}`);
      });
    });
  }

  // delete the other files
  cleanTempFiles (ouPath) {
    if (!ouPath) return
    var _this = this;
    fs.readdir(ouPath, function (err, files) {
      if (err) return
      if(_this.getConfig('dashKeep')){
        files.filter((filename) => isTemFiles(filename)).forEach((filename) => {
          fs.unlinkSync(`${ouPath}/${filename}`);
        });
      }
      else {
        files.filter((filename) => isTemFiles(filename)||isDashFile(filename)).forEach((filename) => {
          fs.unlinkSync(`${ouPath}/${filename}`);
        });
      }
    });
  }

  // Generate the VOD manifest
  generateManifest(ouPath, segmentPrefix = "index") {
    const segmentFiles = fs.readdirSync(ouPath).filter((file => file.startsWith(segmentPrefix) && file.endsWith(".ts")))
    const concatSegments = segmentFiles.map((file) => `file ${file}`).join("\n")

    fs.writeFileSync(`${ouPath}/segments.txt`, concatSegments)

    const input = `${ouPath}/segments.txt`
    const output = `${ouPath}/index.m3u8`
    const ffmpeg = spawn(this.conf.ffmpeg, [
      '-f', 'concat', '-safe', '0', '-i', input, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb',
      '-f', 'hls', '-hls_time', '5', '-hls_playlist_type', 'vod', output
    ])

    ffmpeg.on("error", (error) => console.error(`Error spawning FFMEG process: ${error.message}`))

    ffmpeg.on("close", (code) => {
      console.log("VOD manifest created successfullly");
      // Supprimer le fichier segments.txt
      fs.unlinkSync(input)
    })
  }
}

module.exports = TransSession;
