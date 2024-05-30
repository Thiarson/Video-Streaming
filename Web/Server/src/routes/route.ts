import path from "node:path";
import fs from "node:fs";
import type { Express } from "express"

import authRouter from "./auth.route";
import contentRouter from "./content.route";

const src = path.dirname(__dirname)
const root = path.dirname(src)
const client = path.join(root, 'public/client')

module.exports = (app: Express) => {
  // Endpoints for users
  app.use("/api", authRouter)

  // Endpoint for content
  app.use("/api/", contentRouter)

  // Endpoint for get the media content with homemade hls-server


  // Endpoint when user image is requested
  app.get("/data/*", (req, res) => {
    try {
      const format = [ ".jpg" ]
      const extension = path.extname(req.url)

      if (format.indexOf(extension) === -1)
        throw new Error("Data or image format is invalid")

      const imagePath = path.join(root, req.url)
      const image = fs.readFileSync(imagePath)
      
      res.send(image)
    } catch (e) {
      if (e instanceof Error)
        console.error(e.message);
      else
        console.error(`Unepected error: ${e}`);
        
      res.sendFile(path.join(client, 'index.html'))
    }
  })

  // Endpoint for web client
  app.get("/", (req, res) => {
    res.sendFile(path.join(client, 'index.html'))
  });

  app.get("/static/js/main.*.js", (req, res) => {
    res.sendFile(path.join(client, req.url))
  });

  app.get("/static/css/main.*.css", (req, res) => {
    res.sendFile(path.join(client, req.url))
  });

  app.get("/manifest.json", (req, res) => {
    res.sendFile(path.join(client, req.url))
  });

  app.get("/favicon.ico", (req, res) => {
    const faviconPath = path.join(client, req.url)
    const favicon = fs.readFileSync(faviconPath)
    
    res.send(favicon)
  });

  // Redirect to index.html for undefined endpoints
  app.all("*", (req, res) => {
    res.sendFile(path.join(client, 'index.html'))
  });

  // Error for undefined endpoints
  // app.all("*", (req, res) => {
  //   res.status(404).json({ message: "The URL is undefined" });
  // });
};
