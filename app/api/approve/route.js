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
      return new Response(
        JSON.stringify({ success: false, error: "No se proporcionó public_id" }),
        { status: 400 }
      );
    }

    // Verificar existencia en Cloudinary
    let resource;
    try {
      resource = await cloudinary.api.resource(public_id);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: "La foto no existe en Cloudinary" }),
        { status: 404 }
      );
    }

    // Si ya está aprobado, no mover
    if (resource.folder === "approved") {
      return new Response(
        JSON.stringify({ success: true, message: "Foto ya aprobada" }),
        { status: 200 }
      );
    }

    // Solo mover si está en pending
    if (resource.folder !== "pending") {
      return new Response(
        JSON.stringify({ success: false, error: `Foto en carpeta inesperada: ${resource.folder}` }),
        { status: 400 }
      );
    }

    const newId = public_id.replace(/^pending\//, "approved/");
    const result = await cloudinary.uploader.rename(public_id, newId, { overwrite: true });

    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (err) {
    console.error("Error aprobando foto:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
