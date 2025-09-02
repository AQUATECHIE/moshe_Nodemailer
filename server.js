import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mosheschool.tech@gmail.com",
    pass: "rcbx syti iaap yela" // ← use env vars in production!
  }
});

// ========== APPLY ROUTE ==========
app.post("/apply", async (req, res) => {
  const { name, email, phone, course, country } = req.body;

  if (!name || !email || !phone || !course) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Admin notification
    await transporter.sendMail({
      from: `"Moshe School of AI" <mosheschool.tech@gmail.com>`,
      to: "mosheschool.tech@gmail.com",
      subject: "📩 New Course Application",
      html: `
        <h3>New Application Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Country:</b> ${country || "Not provided"}</p>
        <p><b>Course:</b> ${course}</p>
      `
    });

    // User confirmation
    await transporter.sendMail({
      from: `"Moshe School of AI" <mosheschool.tech@gmail.com>`,
      to: email,
      subject: "✅ Application Received",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for applying for <b>${course}</b> at Moshe School of AI.</p>
        <p>We will contact you soon with more details.</p>
        <br>
        <p>For more enquiries, click on the WhatsApp link below:</p>
        <p>WhatsApp: <a href="https://wa.me/message/GCBD7EWA6V2MB1" target="_blank">+234 901 288 9078</a></p>
        <br>
        <p>Best regards,<br>Moshe School of AI Team</p>
      `
    });

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});


// ========== SPONSOR ROUTE ==========
app.post("/sponsor", async (req, res) => {
  const {
    organizationName,
    organizationType,
    address,
    website,
    fullName,
    position,
    phone,
    email,
    programTitle,
    programDescription,
    demographic,
    beneficiaries,
    duration,
    deliveryMode,
    support,
    consent,
    signature,
  } = req.body;

  // Basic validation
  if (!organizationName || !organizationType || !fullName || !email || !programTitle) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Admin notification
    await transporter.sendMail({
      from: `"Moshe School of AI" <mosheschool.tech@gmail.com>`,
      to: "mosheschool.tech@gmail.com",
      subject: "🤝 New Sponsor Proposal",
      html: `
        <h3>New Sponsorship Proposal</h3>
        <p><b>Organization Name:</b> ${organizationName}</p>
        <p><b>Type:</b> ${organizationType}</p>
        <p><b>Address:</b> ${address}</p>
        <p><b>Website/Social:</b> ${website || "N/A"}</p>
        <hr>
        <p><b>Contact Name:</b> ${fullName}</p>
        <p><b>Position/Title:</b> ${position || "N/A"}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <hr>
        <h4>Proposed Program</h4>
        <p><b>Title:</b> ${programTitle}</p>
        <p><b>Description:</b> ${programDescription}</p>
        <p><b>Target Demographic:</b> ${demographic || "N/A"}</p>
        <p><b>Youth Benefiting:</b> ${beneficiaries || "N/A"}</p>
        <p><b>Duration:</b> ${duration || "N/A"}</p>
        <p><b>Delivery Mode:</b> ${deliveryMode || "N/A"}</p>
        <hr>
        <h4>Support Offered:</h4>
        <ul>
          ${support && support.length > 0 ? support.map((s) => `<li>${s}</li>`).join("") : "<li>No support selected</li>"}
        </ul>
        <hr>
        <p><b>Consent:</b> ${consent ? "Yes ✅" : "No ❌"}</p>
        <p><b>Signature:</b> ${signature}</p>
      `,
    });

    // Sponsor confirmation
    await transporter.sendMail({
      from: `"Moshe School of AI" <mosheschool.tech@gmail.com>`,
      to: email,
      subject: "✅ Sponsorship Proposal Received",
      html: `
        <h3>Hello ${fullName},</h3>
        <p>Thank you for submitting your sponsorship proposal: <b>${programTitle}</b>.</p>
        <p>We will review it and contact you soon.</p>
        <br>
        <p>For more enquiries, click on the WhatsApp link below:</p>
        <p>WhatsApp: <a href="https://wa.me/message/GCBD7EWA6V2MB1" target="_blank">+234 901 288 9078</a></p>
        <br>
        <p>Best regards,<br>Moshe School of AI Team</p>
      `,
    });

    res.json({ success: true, message: "Sponsorship proposal submitted successfully" });
  } catch (error) {
    console.error("Sponsor email error:", error);
    res.status(500).json({ success: false, message: "Error sending sponsorship email" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
