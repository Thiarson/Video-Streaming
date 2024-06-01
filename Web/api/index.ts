import https from "node:https";

import dotenv from "dotenv";

import app from "./app";
const { httpsOptions } = require("./config/server-config")

dotenv.config();

// listnening port
const PORT = process.env.PORT || 8080;

const server = https.createServer(httpsOptions, app)

server.on('request', (req, res) => {
  console.log(`${req.method} ${req.url}`);
})

server.listen(PORT, () => {
  console.log(`Listing on port ${PORT}`);
});

export default server
