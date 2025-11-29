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

    if (!public_id.includes("/")) public_id = `approved/${public_id}`;

    await cloudinary.api.resource(public_id);

    await cloudinary.uploader.destroy(public_id);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error borrando foto:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
