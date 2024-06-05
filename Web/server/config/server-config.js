let ffmpegPath = ""

if (process.platform === "win32")
  ffmpegPath = "C:/Program Files/ffmpeg/bin/ffmpeg.exe"
else if (process.platform === "linux")
  ffmpegPath = ""

module.exports = { ffmpegPath }
