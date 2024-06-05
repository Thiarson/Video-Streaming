const dotenv = require("dotenv")
const { PrismaClient } = require("@prisma/client")

const MediaServer = require("./media-server")
const { ffmpegPath } = require("../config/server-config")

dotenv.config()

const DATABASE_URL = process.env.POSTGRE_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Database URL required")
}

const databaseUrl = new URL(DATABASE_URL)

globalThis.prisma = new PrismaClient({
  datasources: {
    db: { url: databaseUrl.toString() },
  },
})

const config = {
  rtmp: {
    chunk_size: 60000,
    gop_cache: true,
  },
  trans: {
    mediaroot: "./data",
    ffmpeg: ffmpegPath,
    tasks: [
      {
        app: "streaming",
        hls: true,
        hlsFlags: "[hls_time=5:hls_list_size=2:hls_flags=append_list]",
      },
    ]
  },
}

const mediaServer = new MediaServer(config)

mediaServer.run()
