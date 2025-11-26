import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { src } = await req.json(); // recibir ruta relativa desde /uploads/pending/archivo.jpg

    if (!src) {
      return NextResponse.json({ error: "No se proporcionó src" }, { status: 400 });
    }

    const fileName = path.basename(src);
    const pendingPath = path.join(process.cwd(), "public/uploads/pending", fileName);

    if (!fs.existsSync(pendingPath)) {
      return NextResponse.json({ error: "Archivo no encontrado en pending" }, { status: 404 });
    }

    fs.unlinkSync(pendingPath); // borrar el archivo

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error rechazando foto:", err);
    return NextResponse.json({ error: "Error rechazando foto" }, { status: 500 });
  }
}
