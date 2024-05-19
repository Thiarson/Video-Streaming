const fs = require("node:fs")
const path = require("node:path")

const certificates = {
  KEY: "certificates/streaming-video-key.pem",
  CERT: "certificates/streaming-video-cert.pem",
}

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, certificates.KEY)),
  cert: fs.readFileSync(path.join(__dirname, certificates.CERT)),
}

let ffmpegPath = ""

if (process.platform === "win32")
  ffmpegPath = "C:/Program Files/ffmpeg/bin/ffmpeg.exe"
else if (process.platform === "linux")
  ffmpegPath = ""

module.exports =  { httpsOptions, ffmpegPath }
