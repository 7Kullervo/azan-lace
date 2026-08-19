import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ============================================================
// FILE STORAGE
// ------------------------------------------------------------
// Local dev (no R2 env vars set): saves to /public/uploads on disk,
// same as before — zero setup needed to run locally.
//
// Production on free hosting (Render, etc.): free web hosting has
// no persistent disk, so uploaded photos would disappear on every
// restart/redeploy if left on local disk. Once you add Cloudflare
// R2 credentials to .env (see .env.example), uploads automatically
// go to R2 instead — nothing else in the app needs to change.
// ============================================================

const useR2 = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
);

async function uploadToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  // @aws-sdk/client-s3 works with R2 because R2 is S3-API-compatible.
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const publicBase = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");
  return `${publicBase}/${filename}`;
}

// Accepts a multipart/form-data upload with a single "file" field and
// returns its public path/URL. This is what powers "upload from device"
// everywhere in the app — there is never a need to paste an image URL.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to upload files." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP, or GIF images are allowed." }, { status: 400 });
  }

  // Kept comfortably under common hosting-platform request body caps (e.g.
  // Vercel's serverless functions reject bodies over ~4.5MB with a raw,
  // non-JSON error) — with client-side compression in place, a normal
  // photo should never get close to this anyway.
  const maxSizeBytes = 4 * 1024 * 1024; // 4MB
  if (file.size > maxSizeBytes) {
    return NextResponse.json({ error: "Image must be under 4MB. Try a smaller photo, or crop/compress it first." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (useR2) {
    try {
      const url = await uploadToR2(buffer, filename, file.type);
      return NextResponse.json({ path: url }, { status: 201 });
    } catch (err) {
      console.error("[upload] R2 upload failed:", err);
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }
  }

  // Local disk fallback — used automatically when R2 env vars aren't set,
  // which is the normal case for local development.
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ path: `/uploads/${filename}` }, { status: 201 });
}
