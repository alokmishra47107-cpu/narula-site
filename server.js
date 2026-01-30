const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static site (index.html + assets)
app.use(express.static(__dirname));

/**
 * ✅ Gallery API: scans /assets for .jpg/.jpeg/.png/.webp
 * Returns: ["assets/1.jpg", "assets/2.jpg", ...]
 */
app.get("/api/gallery", (req, res) => {
  try {
    const assetsDir = path.join(__dirname, "assets");
    const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"]);

    const files = fs.readdirSync(assetsDir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((name) => allowed.has(path.extname(name).toLowerCase()))
      // Optional: ignore logo
      .filter((name) => !name.toLowerCase().includes("logo"))
      // Sort naturally: 1.jpg, 2.jpg, 10.jpg
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((name) => `assets/${name}`);

    res.json({ ok: true, images: files });
  } catch (err) {
    console.error("Gallery scan error:", err);
    res.status(500).json({ ok: false, images: [], message: "Could not scan assets folder." });
  }
});

/**
 * ✅ Contact email setup (Gmail App Password recommended)
 */
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const TO_EMAIL  = process.env.TO_EMAIL || SMTP_USER;

app.post("/send", async (req, res) => {
  try {
    const { name, email, phone, date, guests, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({ ok: false, message: "Server email not configured. Set SMTP_USER and SMTP_PASS." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const text = `
New Wedding Catering Inquiry

Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Event Date: ${date || "-"}
Guests: ${guests || "-"}

Message:
${message}
`;

    await transporter.sendMail({
      from: `"Narula Website" <${SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New Inquiry: ${name} (${guests || "Guests N/A"})`,
      text,
    });

    res.json({ ok: true, message: "Sent" });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ ok: false, message: "Email failed to send." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running: http://localhost:${PORT}`));
