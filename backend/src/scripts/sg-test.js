import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sgMail from "@sendgrid/mail";

// 👇 manually resolve .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("SG KEY:", process.env.SENDGRID_API_KEY?.slice(0, 5));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: "isonumahto362000@gmail.com",
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: "SendGrid Test",
  text: "If you get this, SendGrid is working 🚀",
});

console.log("✅ Email sent successfully");
