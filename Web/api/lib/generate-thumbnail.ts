import fs from "node:fs"
import { spawn } from "node:child_process"

import sharp from "sharp"

const generateThumbnail = (videoPath: string, tempPath: string, thumbnailPath: string) => {
  let argv = ['-y', '-i', videoPath]

  Array.prototype.push.apply(argv, ['-ss', '00:00:30'])
  Array.prototype.push.apply(argv, ['-vframes', '1'])
  Array.prototype.push.apply(argv, [tempPath])

  const ffmpeg = spawn('C:/Program Files/ffmpeg/bin/ffmpeg.exe', argv)

  ffmpeg.on('close', () => {
    sharp(tempPath)
      .resize(1350, 760)
      .toFile(thumbnailPath, (err, info) => {
        fs.rmSync(tempPath)
      })
  })
}

export { generateThumbnail }
