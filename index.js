const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const videosRoute = require("./routes/videos");

const PORT = process.env.PORT || 5000
const {CORS_ORIGIN} = process.env;

//middleware
app.use(express.json()); 
app.use(cors());
app.use(express.static('public/images')); 

//routes
app.use("/videos", videosRoute);
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
