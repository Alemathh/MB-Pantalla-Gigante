import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { public_id } = await req.json(); // recibir public_id de la foto

    if (!public_id) {
      return new Response(JSON.stringify({ success: false, error: "No se proporcionó public_id" }), { status: 400 });
    }

    // Eliminar la imagen de Cloudinary
    await cloudinary.uploader.destroy(public_id);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error borrando foto:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
