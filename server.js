const express = require("express");
const app = express();

// -------- IMPORTANT FOR RENDER --------
app.enable("trust proxy");

// -------- MIDDLEWARE --------
app.use(express.json());
app.use(express.static("public"));

// -------- DATA --------
let gpsData = {
  lat: 0,
  lon: 0,
  homeLat: null,
  homeLon: null,
  lastSeen: null
};

let radius = 300;
let logs = [];

// =====================================================
// 🔥 MAIN ROUTE (GET - FROM ESP32)
// =====================================================
app.get("/update", (req, res) => {

  console.log("📥 RAW QUERY:", req.query);

  // Validate input
  if (!req.query.lat || !req.query.lon) {
    console.log("❌ INVALID DATA");
    return res.status(400).send("Invalid parameters");
  }

  gpsData = {
    lat: parseFloat(req.query.lat),
    lon: parseFloat(req.query.lon),
    homeLat: parseFloat(req.query.homeLat),
    homeLon: parseFloat(req.query.homeLon),
    lastSeen: Date.now()
  };

  console.log("📍 GPS UPDATE:", gpsData);

  res.send("OK");
});

// =====================================================
// 📍 GET CURRENT LOCATION
// =====================================================
app.get("/location", (req, res) => {

  let now = Date.now();

  let isOnline = gpsData.lastSeen && (now - gpsData.lastSeen < 10000);

  res.json({
    ...gpsData,
    online: isOnline
  });
});

// =====================================================
// 🎯 RADIUS CONTROL
// =====================================================
app.post("/radius", (req, res) => {

  if (!req.body.radius) {
    return res.status(400).send("No radius provided");
  }

  radius = req.body.radius;
  console.log("🎯 Radius Updated:", radius);

  res.send("OK");
});

app.get("/radius", (req, res) => {
  res.json({ radius });
});

// =====================================================
// 📝 LOG SYSTEM
// =====================================================
app.post("/log", (req, res) => {

  let msg = req.body.log || "NO MESSAGE";

  let time = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });

  let fullLog = `[${time}] ${msg}`;

  logs.push(fullLog);
  if (logs.length > 100) logs.shift();

  console.log(fullLog);

  res.send("OK");
});

app.get("/logs", (req, res) => {
  res.json(logs);
});

// =====================================================
// 🟢 HEALTH CHECK
// =====================================================
app.get("/", (req, res) => {
  res.send("🚀 GPS SERVER RUNNING");
});

// =====================================================
// 🚀 START SERVER
// =====================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
