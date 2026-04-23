const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// ---------------- GEOFENCE STORAGE ----------------
let geofence = {
  lat: 19.0760,
  lon: 72.8777,
  radius: 300
};

// ---------------- LAST LOCATION ----------------
let lastLocation = {
  lat: null,
  lon: null
};

// ---------------- ROUTES ----------------

// ✅ GET GEOFENCE (ESP uses this)
app.get("/geofence", (req, res) => {
  res.json(geofence);
});

// ✅ UPDATE GEOFENCE (Website uses this)
app.post("/geofence", (req, res) => {
  const { lat, lon, radius } = req.body;

  geofence.lat = lat;
  geofence.lon = lon;
  geofence.radius = radius;

  console.log("Geofence Updated:", geofence);

  res.json({ status: "ok" });
});

// ✅ GPS UPDATE (ESP sends this)
app.post("/update", (req, res) => {
  const { lat, lon } = req.body;

  lastLocation.lat = lat;
  lastLocation.lon = lon;

  console.log("Location:", lat, lon);

  res.json({ status: "received" });
});

// ✅ GET LAST LOCATION (Website uses)
app.get("/location", (req, res) => {
  res.json(lastLocation);
});

// ✅ LOG
app.post("/log", (req, res) => {
  console.log("LOG:", req.body.log);
  res.json({ ok: true });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
