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

    // Asegurar path correcto
    if (!public_id.startsWith("pending/") && !public_id.startsWith("approved/")) {
      public_id = `pending/${public_id}`;
    }

    // Obtener info real desde Cloudinary
    let resource;
    try {
      resource = await cloudinary.api.resource(public_id);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: "La foto no existe en Cloudinary" }),
        { status: 404 }
      );
    }

    // SI YA ESTÁ APROBADA
    if (public_id.startsWith("approved/")) {
      return new Response(
        JSON.stringify({ success: true, message: "Foto ya aprobada" }),
        { status: 200 }
      );
    }

    // SI NO ES DE pending → error
    if (!public_id.startsWith("pending/")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Foto en carpeta inesperada. Public_id actual: ${public_id}`,
        }),
        { status: 400 }
      );
    }

    // Renombrar a carpeta approved/
    const newId = public_id.replace("pending/", "approved/");

    const result = await cloudinary.uploader.rename(public_id, newId, {
      overwrite: true,
    });

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error aprobando foto:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
