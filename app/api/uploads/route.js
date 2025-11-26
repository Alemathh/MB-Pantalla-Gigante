import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const pendingDir = path.join(process.cwd(), "public/uploads/pending");

    if (!fs.existsSync(pendingDir)) {
      fs.mkdirSync(pendingDir, { recursive: true });
      console.log("Se creó la carpeta pending");
    }

    const formData = await req.formData();
    const file = formData.get("photo");

    if (!file) {
      console.log("No llegó archivo al backend");
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    const fileName = Date.now() + "-" + file.name.replace(/\s+/g, "_");
    const filePath = path.join(pendingDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    console.log("Archivo subido correctamente:", fileName);

    return NextResponse.json({
      success: true,
      file: `/uploads/pending/${fileName}`,
    });
  } catch (err) {
    console.error("Error subiendo archivo:", err);
    return NextResponse.json({ error: "Error subiendo archivo" }, { status: 500 });
  }
}
