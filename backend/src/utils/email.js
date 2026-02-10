import sgMail from "@sendgrid/mail";

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY not found");
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
    html,
  };

  await sgMail.send(msg);
};

export default sendEmail;


console.log("SENDGRID KEY in service:", process.env.SENDGRID_API_KEY?.slice(0, 5));
console.log("FROM EMAIL:", process.env.SENDGRID_FROM_EMAIL);