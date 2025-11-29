export const runtime = "nodejs";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo");

    if (!file) {
      return Response.json({ success: false, error: "No se recibió archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "pending" },
        (error, result) => (error ? reject(error) : resolve(result))
      );

      uploadStream.end(buffer);
    });

    return Response.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Error subiendo archivo:", err);
    return Response.json({ success: false, error: "Error subiendo archivo" }, { status: 500 });
  }
}
