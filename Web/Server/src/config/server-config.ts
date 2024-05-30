import fs from "node:fs"
import path from "node:path"

const certificates = {
  KEY: "certificates/streaming-video-key.pem",
  CERT: "certificates/streaming-video-cert.pem",
}

const src = path.dirname(__dirname)
const root = path.dirname(src)

const httpsOptions = {
  key: fs.readFileSync(path.join(root, certificates.KEY)),
  cert: fs.readFileSync(path.join(root, certificates.CERT)),
}

let ffmpegPath = ""

if (process.platform === "win32")
  ffmpegPath = "C:/Program Files/ffmpeg/bin/ffmpeg.exe"
else if (process.platform === "linux")
  ffmpegPath = ""

export { httpsOptions, ffmpegPath }
