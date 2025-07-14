import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: "resale-prediction",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Auto-detect category via Gemini if image upload is successful
    let category = undefined;
    try {
      const res = await fetch(`${process.env.APP_BASE_URL}/api/detect-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: result.secure_url }),
      });

      const data = await res.json();
      if (data?.category) category = data.category;
    } catch (err) {
      console.warn("Category detection failed:", err);
    }

    return NextResponse.json({
      success: true,
      result,
      category, // include detected category in response
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
