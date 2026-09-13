const express = require("express");
const path = require("path");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.static(publicDir, { extensions: ["html"] }));

app.post("/api/qr", async (req, res) => {
  try {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > 2000) return res.status(400).json({ error: "Invalid QR text" });
    const png = await QRCode.toBuffer(text, { type: "png", width: 512, margin: 2, errorCorrectionLevel: "M" });
    res.type("png").send(png);
  } catch {
    res.status(400).json({ error: "Could not generate QR code" });
  }
});

app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(
`User-agent: *
Allow: /
Sitemap: /sitemap.xml
`);
});

app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/</loc></url>
  <url><loc>/tools</loc></url>
  <url><loc>/about</loc></url>
  <url><loc>/privacy</loc></url>
  <url><loc>/terms</loc></url>
  <url><loc>/contact</loc></url>
</urlset>`);
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((_err, _req, res, _next) => {
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`ToolBox DZ running on port ${PORT}`);
});