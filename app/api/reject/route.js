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

    // 👇 Destruye siempre desde la carpeta pending
    const idToDelete = `pending/${public_id}`;

    await cloudinary.uploader.destroy(idToDelete);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error rechazando foto:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
