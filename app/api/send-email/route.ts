// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type FormData = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

type Body = {
  adminEmail?: string;
  formData?: FormData;
};

function buildPlainText(form: FormData) {
  return `
New inquiry:

Name: ${form.name || "-"}
Email: ${form.email || "-"}
Phone: ${form.phone || "-"}
Subject: ${form.subject || "-"}
Message:
${form.message || "-"}

-- End
  `.trim();
}

function buildHtml(form: FormData) {
  return `
    <h2>New inquiry</h2>
    <p><strong>Name:</strong> ${form.name || "-"}</p>
    <p><strong>Email:</strong> ${form.email || "-"}</p>
    <p><strong>Phone:</strong> ${form.phone || "-"}</p>
    <p><strong>Subject:</strong> ${form.subject || "-"}</p>
    <p><strong>Message:</strong><br/>${(form.message || "-").replace(/\n/g, "<br/>")}</p>
  `;
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: "POST to this endpoint to send email" }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    console.log("API HIT (app router) - body:", JSON.stringify(body, null, 2));

    const adminEmail = body?.adminEmail;
    const form = body?.formData || {};

    if (!adminEmail) {
      console.warn("Missing adminEmail in request body");
      return NextResponse.json({ error: "adminEmail required" }, { status: 400 });
    }

    const subject = `New enquiry from ${form.name || "Website User"}`;
    const text = buildPlainText(form);
    const html = buildHtml(form);

    // Create transporter using env vars
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter (will throw if credentials wrong)
    const verifyInfo = await transporter.verify();
    console.log("SMTP verify result:", verifyInfo);

    const info = await transporter.sendMail({
      from: `"LitAffairs" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject,
      text,
      html,
      replyTo: form.email || undefined,
    });

    console.log("Message sent:", info);

    // If using Ethereal/test account, nodemailer.getTestMessageUrl(info) may be available
    const preview = (info as any)?.preview || (nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : undefined);
    if (preview) console.log("Preview URL:", preview);

    return NextResponse.json({ success: true, info, preview: preview || null }, { status: 200 });
  } catch (err) {
    console.error("Email error (app router):", err);
    return NextResponse.json({ error: "Email failed", details: String(err) }, { status: 500 });
  }
}
