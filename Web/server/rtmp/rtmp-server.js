const Tls = require('node:tls');
const Fs = require('node:fs');
const Net = require('node:net');

const context = require('./core-ctx');
const Logger = require('./core-logger');
const RtmpSession = require('./rtmp-session');

const RTMP_PORT = 1935;
const RTMPS_PORT = 443;

class RtmpServer {
  constructor(config) {
    config.rtmp.port = this.port = config.rtmp.port ? config.rtmp.port : RTMP_PORT;
    this.tcpServer = Net.createServer((socket) => {
      let session = new RtmpSession(config, socket);
      session.run();
    });

    if (config.rtmp.ssl){
      config.rtmp.ssl.port = this.sslPort = config.rtmp.ssl.port ? config.rtmp.ssl.port : RTMPS_PORT;
      try {
        const options = {
          key: Fs.readFileSync(config.rtmp.ssl.key),
          cert: Fs.readFileSync(config.rtmp.ssl.cert)
        };
        this.tlsServer = Tls.createServer(options, (socket) => {
          let session = new RtmpSession(config, socket);
          session.run();
        });
      } catch (e) {
        Logger.error(`Media Rtmps Server error while reading ssl certs: <${e}>`);
      }
    }
  }

  run() {
    this.tcpServer.listen(this.port, () => {
      Logger.log(`Media Rtmp Server started on port: ${this.port}`);
    });

    this.tcpServer.on('error', (e) => {
      Logger.error(`Media Rtmp Server ${e}`);
    });

    this.tcpServer.on('close', () => {
      Logger.log('Media Rtmp Server Close.');
    });

    if (this.tlsServer) {
      this.tlsServer.listen(this.sslPort, () => {
        Logger.log(`Media Rtmps Server started on port: ${this.sslPort}`);
      });

      this.tlsServer.on('error', (e) => {
        Logger.error(`Media Rtmps Server ${e}`);
      });

      this.tlsServer.on('close', () => {
        Logger.log('Media Rtmps Server Close.');
      });
    }
  }

  stop() {
    this.tcpServer.close();

    if (this.tlsServer) {
      this.tlsServer.close();
    }

    context.sessions.forEach((session, id) => {
      if (session instanceof RtmpSession)
        session.stop();
    });
  }
}

module.exports = RtmpServer;
