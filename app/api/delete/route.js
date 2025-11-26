import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { src } = await req.json();
    const filePath = path.join(process.cwd(), "public", src);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Archivo no existe" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error borrando archivo:", err);
    return NextResponse.json(
      { error: "Error borrando archivo" },
      { status: 500 }
    );
  }
}
