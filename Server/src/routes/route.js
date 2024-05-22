const path = require("node:path")
const fs = require("node:fs")

const authRouter = require('./auth.route')

module.exports = (app, root, public) => {
  // Endpoints for users
  app.use("/api", authRouter)

  // Endpoint for content


  // Endpoint for get the media content with homemade hls-server


  // Endpoint when user image is requested
  app.get("/data/*", (req, res) => {
    const imagePath = path.join(root, req.url)
    const image = fs.readFileSync(imagePath)
    
    res.send(image)
  })

  // Endpoint for web client
  app.get("/", (req, res) => {
    res.sendFile(path.join(public, 'client/index.html'))
  });

  app.get("/static/js/main.*.js", (req, res) => {
    res.sendFile(path.join(public, `client/${req.url}`))
  });

  app.get("/static/js/main.*.js.map", (req, res) => {
    res.sendFile(path.join(public, `client/${req.url}`))
  });

  app.get("/static/css/main.*.css", (req, res) => {
    res.sendFile(path.join(public, `client/${req.url}`))
  });

  app.get("/static/css/main.*.css.map", (req, res) => {
    res.sendFile(path.join(public, `client/${req.url}`))
  });

  app.get("/manifest.json", (req, res) => {
    res.sendFile(path.join(public, `client/${req.url}`))
  });

  app.get("/favicon.ico", (req, res) => {
    const faviconPath = path.join(public, `client/${req.url}`)
    const favicon = fs.readFileSync(faviconPath)
    
    res.send(favicon)
  });

  // Redirect to index.html for undefined endpoints
  app.all("*", (req, res) => {
    res.sendFile(path.join(public, 'client/index.html'))
  });

  // Error for undefined endpoints
  // app.all("*", (req, res) => {
  //   res.status(404).json({ message: "The URL is undefined" });
  // });
};
