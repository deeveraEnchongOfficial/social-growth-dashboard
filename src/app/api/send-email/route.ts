import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { loadSettings } from "@/lib/settings-loader";

/**
 * POST /api/send-email
 *
 * Body: { to: string, subject: string, text?: string, html?: string }
 *
 * Sends an email using the configured SMTP provider (Nodemailer).
 * SMTP credentials are read from the database-backed settings.
 */
export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = (await request.json()) as {
      to: string;
      subject: string;
      text?: string;
      html?: string;
    };

    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 }
      );
    }

    if (!text && !html) {
      return NextResponse.json(
        { error: "Either text or html body is required" },
        { status: 400 }
      );
    }

    const settings = await loadSettings();
    const email = settings.email;

    if (email.provider === "none" || !email.smtp.host || !email.smtp.user) {
      return NextResponse.json(
        { error: "Email provider not configured. Set up SMTP in Settings." },
        { status: 400 }
      );
    }

    // Create transporter using SMTP settings from the database
    const transporter = nodemailer.createTransport({
      host: email.smtp.host,
      port: email.smtp.port,
      secure: email.smtp.secure,
      auth: {
        user: email.smtp.user,
        pass: email.smtp.pass,
      },
    });

    const fromName = email.smtp.fromName || settings.workspace.name || "No-Reply";
    const fromEmail = email.smtp.fromEmail || email.smtp.user;
    const from = `"${fromName}" <${fromEmail}>`;

    const mailOptions: nodemailer.SendMailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    console.error("[api/send-email] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
