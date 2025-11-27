"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [images, setImages] = useState([]);
  const [folder, setFolder] = useState("pending");

  const loadImages = async () => {
    try {
      const res = await fetch(`/api/list-uploads?folder=${folder}`);
      const data = await res.json();

      if (data.success) {
        setImages(data.images);
      } else {
        console.error("Error al cargar imágenes:", data.error);
      }
    } catch (err) {
      console.error("Error de fetch:", err);
    }
  };

  useEffect(() => {
    loadImages();
  }, [folder]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Panel Admin</h1>

      <select
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px" }}
      >
        <option value="pending">Pendientes</option>
        <option value="approved">Aprobadas</option>
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {images.map((img) => (
          <div key={img.public_id}>
            <img
              src={img.url}
              alt="foto"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
