import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "pending";

    // Busca solo imágenes dentro del folder
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    const images = result.resources.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
      folder: r.folder,
    }));

    return Response.json({ success: true, images });
  } catch (err) {
    console.error("Error listando imágenes:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
