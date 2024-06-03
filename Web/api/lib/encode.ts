import fs from "node:fs"
import { spawn } from "node:child_process"
import type { ChildProcessWithoutNullStreams } from "node:child_process"

import { mkdirp } from "mkdirp"

const encoding = (inPath: string, name: string, resolution: string, userId: string, title: string) => {
  let outPath = `./data/${userId}/videos/${name}/${resolution}`
  let argv = ['-y', '-i', inPath];
  let scale = ''
  let maxrate = 0
  let bufsize = 0

  if(resolution === '720p') {
    scale = '1280x720'
    // maxrate = '2500k'
    // bufsize = '5000k'
    maxrate = 3500000
    bufsize = 7000000
    
    Array.prototype.push.apply(argv, ['-c:v', 'copy']);
    Array.prototype.push.apply(argv, ['-c:a', 'copy']);
  }
  else if(resolution === '480p') {
    scale = '854x480'
    // maxrate = '1500k'
    // bufsize = '3000k'
    maxrate = 1000000
    bufsize = 2000000

    Array.prototype.push.apply(argv, ['-c:v', 'libx264']);
    Array.prototype.push.apply(argv, ['-c:a', 'aac']);
    Array.prototype.push.apply(argv, ['-s', scale]);
    Array.prototype.push.apply(argv, ['-b:v', maxrate]);
    Array.prototype.push.apply(argv, ['-maxrate', maxrate]);
    Array.prototype.push.apply(argv, ['-bufsize', bufsize]);
    Array.prototype.push.apply(argv, ['-b:a', '128k']);
  }

  mkdirp.sync(outPath);
  fs.accessSync(outPath, fs.constants.W_OK);
  outPath += `/${title}.m3u8`

  Array.prototype.push.apply(argv, ['-f', 'tee', '-map', '0:a?', '-map', '0:v?', '[hls_time=6:hls_list_size=0]' + outPath]);
  argv = argv.filter((n) => { return n; }); 
  
  fs.appendFileSync(`./data/${userId}/videos/${name}/${title}.m3u8`, `#EXT-X-STREAM-INF:BANDWIDTH=${maxrate}, RESOLUTION=${scale}\n${resolution}/${title}.m3u8\n`)
  
  const ffmpeg_exec = spawn('C:/Program Files/ffmpeg/bin/ffmpeg.exe', argv);

  ffmpeg_exec.on('close', () => {
    console.log(`Encodage ${resolution} terminé !`);
  })

  return ffmpeg_exec
}

const encodeHls = (inPath: string, name: string, resolutions: string[], userId: string, title: string) => {
  let ffmpeg_exec: ChildProcessWithoutNullStreams | undefined

  resolutions.forEach((resolution) => {
    ffmpeg_exec = encoding(inPath, name, resolution, userId, title)
  })

  if (!ffmpeg_exec)
    throw new Error("Encoding error")

  ffmpeg_exec.on('close', () => {
    setTimeout(() => {
      fs.rmSync(inPath)
    }, 5000);
  })
}

export { encodeHls }
