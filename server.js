const express = require("express");
const app = express();

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

// -------- GPS UPDATE --------
app.post("/update", (req, res) => {
  gpsData = req.body;

  // 🔥 TRACK LAST SEEN
  gpsData.lastSeen = Date.now();

  console.log("📍 GPS:", gpsData);
  res.send("OK");
});

// -------- GET LOCATION --------
app.get("/location", (req, res) => {

  let now = Date.now();

  // 🔥 ONLINE CHECK (10 sec timeout)
  let isOnline = gpsData.lastSeen && (now - gpsData.lastSeen < 10000);

  res.json({
    ...gpsData,
    online: isOnline
  });
});

// -------- RADIUS --------
app.post("/radius", (req, res) => {
  radius = req.body.radius;
  console.log("🎯 Radius:", radius);
  res.send("OK");
});

app.get("/radius", (req, res) => {
  res.json({ radius });
});

// -------- LOGS WITH IST --------
app.post("/log", (req, res) => {

  let msg = req.body.log;

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

// -------- START --------
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running");
});
