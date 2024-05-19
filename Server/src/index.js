const https = require("node:https")
// const http = require("node:http");

const dotenv = require("dotenv");
// const HLSServer = require("hls-server")

const app = require("./app");
const { httpsOptions } = require("./config/server-config")
// const { hlsConfig } = require("./config/server-config")

dotenv.config();

// listnening port
const PORT = process.env.PORT || 8080;

const server = https.createServer(httpsOptions, app)
// const server = http.createServer(app);
// const hls = new HLSServer(server, hlsConfig)

server.on('request', (req, res) => {
  console.log(`${req.method} ${req.url}`);
})

server.listen(PORT, () => {
  console.log(`Listing on port ${PORT}`);
});
