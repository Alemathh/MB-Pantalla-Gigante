import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return new Response(JSON.stringify({ success: false, error: "No se proporcionó public_id" }), { status: 400 });
    }

    const newPublicId = public_id.replace("pending/", "approved/");

    const result = await cloudinary.uploader.rename(public_id, newPublicId, {
      overwrite: true,
    });

    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (err) {
    console.error("Error aprobando foto:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
