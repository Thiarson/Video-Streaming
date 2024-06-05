const context = require('./core-ctx');
const Logger = require('./core-logger');
const RtmpServer = require('./rtmp-server');
const TransServer = require('./trans-server');

class MediaServer {
  constructor(config) {
    this.config = config;
  }

  run() {
    this.rtmpServer = new RtmpServer(this.config)
    this.transServer = new TransServer(this.config)

    this.rtmpServer.run()
    this.transServer.run()

    process.on('uncaughtException', function (err) {
      Logger.error('uncaughtException', err);
    });

    process.on('SIGINT', function() {
      process.exit();
    });
  }

  on(eventName, listener) {
    context.nodeEvent.on(eventName, listener);
  }

  stop() {
    this.rtmpServer.stop()
    this.transServer.stop()
  }

  getSession(id) {
    return context.sessions.get(id);
  }
}

module.exports = MediaServer;
