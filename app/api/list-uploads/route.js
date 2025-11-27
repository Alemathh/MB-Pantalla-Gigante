import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") === "pending" ? "pending" : "approved";

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    const images = result.resources.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id, // 🚨 Mantener exacto
    }));

    return new Response(JSON.stringify({ success: true, images }), { status: 200 });
  } catch (err) {
    console.error("Error listando fotos:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
