const path = require("node:path");
const bodyParser = require("body-parser")
const cors = require("cors");

const express = require("express");

// Initialize express app
const app = express();

app.use(cors({
  origin: "*",
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Path to the public directory
const public = path.join(__dirname, "public");
const root = __dirname

// Import all the routes
require("./routes/route")(app, root, public);

module.exports = app;
