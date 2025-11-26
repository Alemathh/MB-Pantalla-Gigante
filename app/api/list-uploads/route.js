import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") === "pending" ? "pending" : "";
    const uploadDir = path.join(process.cwd(), "public/uploads", folder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const files = fs
      .readdirSync(uploadDir)
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((file) => `/uploads/${folder ? folder + "/" : ""}${file}`);

    return NextResponse.json({ images: files });
  } catch (err) {
    console.error("Error listando archivos:", err);
    return NextResponse.json(
      { error: "No se pudieron listar los archivos" },
      { status: 500 }
    );
  }
}
