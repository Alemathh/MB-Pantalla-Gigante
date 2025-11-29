import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || ""; // ⬅️ FIX: evita error si no viene el parámetro

    const result = await cloudinary.search
      .expression(`folder:${folder}*`) // función segura
      .sort_by("public_id", "desc")
      .max_results(200)
      .execute();

    const images = result.resources.map((img) => img.secure_url);

    return Response.json({ images });
  } catch (err) {
    console.error("Error listando imágenes:", err);
    return Response.json({ images: [], error: true });
  }
}
