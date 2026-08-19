import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Make sure only logged-in users can upload
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to upload files." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, WEBP, or GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    // Maximum 4MB
    const maxSizeBytes = 4 * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        {
          error:
            "Image must be under 4MB. Try a smaller photo, or crop/compress it first.",
        },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "azan-lace",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (!result) {
            reject(new Error("Cloudinary returned no result."));
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json(
      {
        path: result.secure_url,
        url: result.secure_url,
        publicId: result.public_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[upload] Cloudinary upload failed:", error);

    return NextResponse.json(
      {
        error: "Upload failed. Please try again.",
      },
      { status: 500 }
    );
  }
}