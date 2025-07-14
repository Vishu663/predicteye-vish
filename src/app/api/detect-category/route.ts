import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const imageRes = await fetch(imageUrl);
    const mimeType = imageRes.headers.get("content-type") || "image/png"; // ✅ fallback to png if missing
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      "Classify the product image into a resale category. Only respond with the category name. Example categories: Chair, Table, Sofa, Bed, etc.",
      {
        inlineData: {
          mimeType, // ✅ dynamically set
          data: base64Image,
        },
      },
    ]);

    console.log("Gemini response:", result.response.text());

    const category = result.response.text().trim();

    return NextResponse.json({ category });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to detect category" },
      { status: 500 }
    );
  }
}
