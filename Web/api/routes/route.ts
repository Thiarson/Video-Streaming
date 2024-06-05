import path from "node:path";
import fs from "node:fs";
import type { Express } from "express"

import authRouter from "./auth.route";
import contentRouter from "./content.route";
import streamRouter from "./stream.route";

const src = path.dirname(__dirname)
const root = path.dirname(src)
const server = path.join(root, 'server/public')

module.exports = (app: Express) => {
  // Endpoints for users
  app.use("/api", authRouter)

  // Endpoint for content
  app.use("/api/", contentRouter)

  // Endpoint for get the media content with homemade hls-server
  app.use("/streams/", streamRouter)

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
        
      res.sendFile(path.join(server, 'index.html'))
    }
  })

  // Endpoint for web client
  app.get("/", (req, res) => {
    res.sendFile(path.join(server, 'index.html'))
  });

  app.get("/static/js/*", (req, res) => {
    try {
      const js = path.join(server, req.url)
    
      if (!fs.existsSync(js))
        throw new Error("This ressource is unavailabe")

      res.sendFile(js)
    } catch (e) {
      if (e instanceof Error)
        console.error(e.message);
      else
        console.error(`Unepected error: ${e}`);
        
      res.sendFile(path.join(server, 'index.html'))
    }
  });

  app.get("/static/css/*", (req, res) => {
    try {
      const css = path.join(server, req.url)
    
      if (!fs.existsSync(css))
        throw new Error("This ressource is unavailabe")

      res.sendFile(css)
    } catch (e) {
      if (e instanceof Error)
        console.error(e.message);
      else
        console.error(`Unepected error: ${e}`);
        
      res.sendFile(path.join(server, 'index.html'))
    }
  });

  app.get("/manifest.json", (req, res) => {
    res.sendFile(path.join(server, req.url))
  });

  app.get("/favicon.ico", (req, res) => {
    const faviconPath = path.join(server, req.url)
    const favicon = fs.readFileSync(faviconPath)
    
    res.send(favicon)
  });

  // Redirect to index.html for undefined endpoints
  app.all("*", (req, res) => {
    res.sendFile(path.join(server, 'index.html'))
  });

  // Error for undefined endpoints
  // app.all("*", (req, res) => {
  //   res.status(404).json({ message: "The URL is undefined" });
  // });
};
