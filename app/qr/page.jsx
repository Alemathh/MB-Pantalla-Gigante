"use client";

import { useState } from "react";
import QRCode from "qrcode";
import config from "../../config.json";

export default function QRPage() {
  const [qrURL, setQrURL] = useState("");

  const generarQR = async () => {
    try {
      // Siempre apuntamos a /upload
      const urlEvento = `${window.location.origin}${config.urlUpload}`;
      const dataURL = await QRCode.toDataURL(urlEvento);
      setQrURL(dataURL);
    } catch (err) {
      console.error("Error generando QR:", err);
      alert("Error generando QR");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f0f2f5",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "30px", color: "#333" }}>🔳 QR - Subir Fotos</h1>

      <button
        onClick={generarQR}
        style={{
          padding: "12px 25px",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Generar QR
      </button>

      {qrURL && (
        <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={qrURL}
            alt="QR Code"
            style={{
              width: "300px",
              height: "300px",
              background: "#fff",
              padding: "10px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          />
          <a
            href={qrURL}
            download="QR_Evento.png"
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "#28a745",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Descargar QR
          </a>
        </div>
      )}
    </div>
  );
}
