const fs = require('node:fs');
const mkdirp = require('mkdirp');
const _ = require('lodash');

const TransSession = require('./trans-session');
const context = require('./core-ctx');
const Logger = require('./core-logger');
const { getFFmpegVersion, getFFmpegUrl } = require('./core-utils');

class TransServer {
  constructor(config) {
    this.config = config;
    this.transSessions = new Map();
  }

  async run() {
    try {
      // mkdirp.sync(this.config.http.mediaroot);
      // fs.accessSync(this.config.http.mediaroot, fs.constants.W_OK);
      mkdirp.sync(this.config.trans.mediaroot);
      fs.accessSync(this.config.trans.mediaroot, fs.constants.W_OK);
    } catch (error) {
      // Logger.error(`Media Trans Server startup failed. MediaRoot:${this.config.http.mediaroot} cannot be written.`);
      Logger.error(`Media Trans Server startup failed. MediaRoot:${this.config.trans.mediaroot} cannot be written.`);
      return;
    }

    try {
      fs.accessSync(this.config.trans.ffmpeg, fs.constants.X_OK);
    } catch (error) {
      Logger.error(`Media Trans Server startup failed. ffmpeg:${this.config.trans.ffmpeg} cannot be executed.`);
      return;
    }

    let version = await getFFmpegVersion(this.config.trans.ffmpeg);
    if (version === '' || parseInt(version.split('.')[0]) < 4) {
      Logger.error('Media Trans Server startup failed. ffmpeg requires version 4.0.0 above');
      Logger.error('Download the latest ffmpeg static program:', getFFmpegUrl());
      return;
    }

    let i = this.config.trans.tasks.length;
    let apps = '';
    while (i--) {
      apps += this.config.trans.tasks[i].app;
      apps += ' ';
    }
    context.nodeEvent.on('postPublish', this.onPostPublish.bind(this));
    context.nodeEvent.on('donePublish', this.onDonePublish.bind(this));
    // Logger.log(`Media Trans Server started for apps: [ ${apps}] , MediaRoot: ${this.config.http.mediaroot}, ffmpeg version: ${version}`);
    Logger.log(`Media Trans Server started for apps: [ ${apps}] , MediaRoot: ${this.config.trans.mediaroot}, ffmpeg version: ${version}`);
  }

  async onPostPublish(id, streamPath, args) {
    let regRes = /\/(.*)\/(.*)/gi.exec(streamPath);
    let [app, name] = _.slice(regRes, 1);

    // Trouver le contenu à partir du clé dans la base de données qui correspond à la clé de diffusion
    const direct = await globalThis.prisma.directContent.findFirst({ where: { directKey: name } })
    const outPath = `${this.config.trans.mediaroot}/${direct.userId}/direct/${direct.directId}`

    let i = this.config.trans.tasks.length;
    while (i--) {
      let conf = { ...this.config.trans.tasks[i] };
      
      // Insérer l'id du contenu et de l'utilisateur dans la configuration pour les transmettre au session
      conf.directId = direct.directId
      conf.userId = direct.userId
      conf.mediaroot = outPath
      // conf.mediaroot = this.config.http.mediaroot;
      conf.ffmpeg = this.config.trans.ffmpeg;
      conf.rtmpPort = this.config.rtmp.port;
      conf.streamPath = streamPath;
      conf.streamApp = app;
      conf.streamName = name;
      conf.args = args;

      if (app === conf.app) {
        let session = new TransSession(conf);
        this.transSessions.set(id, session);
        session.on('end', () => {
          this.transSessions.delete(id);
        });
        session.run();
      }
    }
  }

  onDonePublish(id, streamPath, args) {
    let session = this.transSessions.get(id);
    if (session) {
      session.end();
    }
  }
}

module.exports = TransServer;
