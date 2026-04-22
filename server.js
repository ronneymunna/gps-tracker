const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// -------- DATA --------
let gpsData = {
  lat: 21.125,
  lon: 79.046,
  homeLat: null,
  homeLon: null
};

let radius = 300;
let logs = [];

// -------- ROUTES --------

// GPS UPDATE
app.post("/update", (req, res) => {
  gpsData = req.body;
  console.log("📍 GPS:", gpsData);
  res.send("OK");
});

// GET GPS
app.get("/location", (req, res) => {
  res.json(gpsData);
});

// SET RADIUS
app.post("/radius", (req, res) => {
  radius = req.body.radius;
  console.log("🎯 Radius:", radius);
  res.send("OK");
});

// GET RADIUS
app.get("/radius", (req, res) => {
  res.json({ radius: radius });
});

// -------- LOG WITH TIME --------
app.post("/log", (req, res) => {
  let msg = req.body.log;

  let time = new Date().toLocaleTimeString();
  let fullLog = `[${time}] ${msg}`;

  logs.push(fullLog);

  if (logs.length > 100) logs.shift();

  console.log(fullLog);
  res.send("OK");
});

// GET LOGS
app.get("/logs", (req, res) => {
  res.json(logs);
});

// START SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running");
});
