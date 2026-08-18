// ============================================================
// NOTIFICATIONS SERVICE
// ------------------------------------------------------------
// Called from src/app/api/admin/orders/[id]/status/route.ts
// whenever the admin changes an order's status.
//
// Each channel below checks whether its .env credentials are
// set. If they're not, it safely skips (and logs to the server
// console) instead of crashing — so the site works end-to-end
// right away, and you can turn on each channel independently
// as you get API keys for it. Nothing else in the app needs to
// change when you do.
// ============================================================

import { STATUS_LABELS } from "@/lib/utils";

type NotifyParams = {
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  orderNumber: string;
  status: string;
  pushToken?: string | null;
};

function statusMessage(orderNumber: string, status: string): string {
  return `Azan Lace — Your order ${orderNumber} is now: ${STATUS_LABELS[status] ?? status}`;
}

// ---------- EMAIL (Nodemailer) ----------
async function sendEmail(params: NotifyParams) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log("[notify:email] Skipped — SMTP_HOST/SMTP_USER/SMTP_PASS not set in .env");
    return;
  }

  // Install nodemailer first: npm install nodemailer @types/nodemailer
  // Then uncomment the block below.
  /*
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({
    from: `"Azan Lace" <${SMTP_USER}>`,
    to: params.customerEmail,
    subject: `Order ${params.orderNumber} update`,
    text: statusMessage(params.orderNumber, params.status),
  });
  */
  console.log(`[notify:email] Would send to ${params.customerEmail}: ${statusMessage(params.orderNumber, params.status)}`);
}

// ---------- SMS (Twilio) ----------
async function sendSMS(params: NotifyParams) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !params.customerPhone) {
    console.log("[notify:sms] Skipped — Twilio env vars or customer phone not set");
    return;
  }

  // Install twilio first: npm install twilio
  // Then uncomment the block below.
  /*
  const twilio = (await import("twilio")).default;
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: statusMessage(params.orderNumber, params.status),
    from: TWILIO_FROM_NUMBER,
    to: params.customerPhone,
  });
  */
  console.log(`[notify:sms] Would send to ${params.customerPhone}: ${statusMessage(params.orderNumber, params.status)}`);
}

// ---------- WHATSAPP (WhatsApp Business Cloud API) ----------
async function sendWhatsApp(params: NotifyParams) {
  const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_ID } = process.env;
  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_ID || !params.customerPhone) {
    console.log("[notify:whatsapp] Skipped — WhatsApp env vars or customer phone not set");
    return;
  }

  // Direct REST call — no extra package needed.
  /*
  await fetch(`https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.customerPhone,
      type: "text",
      text: { body: statusMessage(params.orderNumber, params.status) },
    }),
  });
  */
  console.log(`[notify:whatsapp] Would send to ${params.customerPhone}: ${statusMessage(params.orderNumber, params.status)}`);
}

// ---------- PUSH (Firebase Cloud Messaging) ----------
async function sendPush(params: NotifyParams) {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !params.pushToken) {
    console.log("[notify:push] Skipped — Firebase env vars or device push token not set");
    return;
  }

  // Install firebase-admin first: npm install firebase-admin
  // Then uncomment the block below (initialize the admin app once,
  // e.g. in this file guarded by a module-level flag).
  /*
  const admin = await import("firebase-admin");
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
  await admin.messaging().send({
    token: params.pushToken,
    notification: {
      title: "Order update",
      body: statusMessage(params.orderNumber, params.status),
    },
  });
  */
  console.log(`[notify:push] Would send push: ${statusMessage(params.orderNumber, params.status)}`);
}

// Fires all four channels whenever an order's status changes. Each one
// fails silently (logged, not thrown) so one broken channel never blocks
// the others or the status update itself.
export async function notifyOrderStatusChange(params: NotifyParams) {
  const results = await Promise.allSettled([
    sendEmail(params),
    sendSMS(params),
    sendWhatsApp(params),
    sendPush(params),
  ]);
  results.forEach((r) => {
    if (r.status === "rejected") console.error("[notify] channel failed:", r.reason);
  });
}
