const express = require("express");
const app = express();

// 🔥 TRUST PROXY (IMPORTANT FOR RENDER)
app.enable("trust proxy");

// 🔥 FORCE ALLOW HTTP (PREVENT 307 REDIRECT ISSUES)
app.use((req, res, next) => {
  const proto = req.headers["x-forwarded-proto"];
  if (proto === "http") {
    return next();
  }
  return next();
});

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

// -------- GPS UPDATE --------
app.post("/update", (req, res) => {

  console.log("📥 RAW BODY:", req.body);

  // 🔴 HANDLE EMPTY BODY (IMPORTANT)
  if (!req.body || Object.keys(req.body).length === 0) {
    console.log("❌ EMPTY BODY RECEIVED");
    return res.status(400).send("Invalid JSON");
  }

  gpsData = req.body;

  // 🔥 ADD LAST SEEN
  gpsData.lastSeen = Date.now();

  console.log("📍 GPS UPDATE:", gpsData);

  res.status(200).send("OK");
});

// -------- GET LOCATION --------
app.get("/location", (req, res) => {

  let now = Date.now();

  let isOnline = gpsData.lastSeen && (now - gpsData.lastSeen < 10000);

  res.json({
    ...gpsData,
    online: isOnline
  });
});

// -------- RADIUS --------
app.post("/radius", (req, res) => {
  radius = req.body.radius;
  console.log("🎯 Radius Updated:", radius);
  res.send("OK");
});

app.get("/radius", (req, res) => {
  res.json({ radius });
});

// -------- LOGS --------
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

// -------- HEALTH CHECK --------
app.get("/", (req, res) => {
  res.send("🚀 GPS SERVER RUNNING");
});

// -------- START --------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
