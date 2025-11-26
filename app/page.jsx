"use client";

import { useEffect, useState, useCallback } from "react";
import config from "../config.json";

export default function Page() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/list-uploads");
      const data = await res.json();
      if (data.images) setImages(data.images);
    } catch (err) {
      console.error("Error cargando imágenes:", err);
    }
  }, []);

  useEffect(() => {
    fetchImages();
    const fetchInterval = setInterval(fetchImages, 10000);
    return () => clearInterval(fetchInterval);
  }, [fetchImages]);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={config.fondo} type="video/mp4" />
        Tu navegador no soporta videos.
      </video>

      {/* Contenido encima */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        {/* Texto principal */}
        <h1
          style={{
            fontSize: "3rem",
            color: config.colorTextoPrincipal,
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            marginBottom: "20px",
          }}
        >
          {config.textoPrincipal}
        </h1>

        {/* Carrusel de fotos */}
        <div
          style={{
            position: "relative",
            marginTop: "10px",
            width: "90vw",
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {images.length === 0 ? (
            <p style={{ color: "#ccc", textShadow: "0 1px 5px rgba(0,0,0,0.5)" }}>
              No hay fotos subidas aún.
            </p>
          ) : (
            <img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Foto ${currentIndex + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                transition: "opacity 0.5s ease-in-out",
              }}
            />
          )}
        </div>

        {/* Botón Administrar Fotos */}
        <a
          href={config.urlAdmin}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            background: "rgba(255,255,255,0.1)", // fondo semi-transparente
            backdropFilter: "blur(8px)", // efecto blur
            color: "#fff",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.2)",
            transition: "0.3s all",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          ⚙️ Administrar Fotos
        </a>
      </div>
    </div>
  );
}
