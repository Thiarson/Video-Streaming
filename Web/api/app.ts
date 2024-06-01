import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Initialize express app
const app = express();

app.use(cors({
  origin: "*",
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import all the routes
require("./routes/route")(app);

export default app
