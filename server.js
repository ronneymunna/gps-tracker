const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔥 Serve your website
app.use(express.static("public"));

// Store latest GPS
let gpsData = {
  lat: 21.125470,
  lon: 79.046180,
  homeLat: null,
  homeLon: null
};

// Store radius
let radius = 300;

// -------- RECEIVE GPS --------
app.post("/update", (req, res) => {
  gpsData = req.body;
  console.log("📍 New Location:", gpsData);
  res.send("OK");
});

// -------- SEND GPS --------
app.get("/location", (req, res) => {
  res.json(gpsData);
});

// -------- SET RADIUS --------
app.post("/radius", (req, res) => {
  radius = req.body.radius;
  console.log("🎯 Radius updated:", radius);
  res.send("OK");
});

// -------- GET RADIUS --------
app.get("/radius", (req, res) => {
  res.json({ radius });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});