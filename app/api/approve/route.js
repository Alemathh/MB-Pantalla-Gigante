import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    let { public_id } = await req.json();

    if (!public_id) {
      return Response.json({ success: false, error: "No se proporcionó public_id" }, { status: 400 });
    }

    // Si viene sin carpeta → asumir pending/
    if (!public_id.includes("/")) public_id = `pending/${public_id}`;

    // Verificar existencia real
    await cloudinary.api.resource(public_id);

    const newId = public_id.replace("pending/", "approved/");

    const result = await cloudinary.uploader.rename(public_id, newId, {
      overwrite: true,
    });

    return Response.json({ success: true, result });
  } catch (err) {
    console.error("Error aprobando foto:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
