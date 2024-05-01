import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

interface EmailData {
  recipient: string;
  subject: string;
  htmlContent: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { recipient, subject, htmlContent }: EmailData = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL as string,
      to: recipient,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Error sending email" });
  }
}
