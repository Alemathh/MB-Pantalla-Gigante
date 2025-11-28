"use client";

import { useEffect, useState } from "react";
import config from "../../config.json";

export default function AdminPage() {
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [approvedPhotos, setApprovedPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState("pendientes");

  const fetchPhotos = async () => {
    try {
      const resPending = await fetch("/api/list-uploads?folder=pending");
      const dataPending = await resPending.json();
      setPendingPhotos(dataPending.images || []);

      const resApproved = await fetch("/api/list-uploads?folder=approved");
      const dataApproved = await resApproved.json();
      setApprovedPhotos(dataApproved.images || []);
    } catch (err) {
      console.error("Error al cargar fotos:", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const aprobarFoto = async (public_id) => {
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
      });
      const data = await res.json();
      if (data.success) fetchPhotos();
      else alert("No se pudo aprobar: " + data.error);
    } catch (err) {
      console.error(err);
      alert("Error aprobando la foto");
    }
  };

  const rechazarFoto = async (public_id) => {
    try {
      const res = await fetch("/api/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
      });
      const data = await res.json();
      if (data.success) fetchPhotos();
      else alert("No se pudo rechazar: " + data.error);
    } catch (err) {
      console.error(err);
      alert("Error rechazando la foto");
    }
  };

  const borrarFoto = async (public_id) => {
    if (!confirm("¿Borrar esta foto?")) return;
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
      });
      const data = await res.json();
      if (data.success) fetchPhotos();
      else alert("No se pudo borrar: " + data.error);
    } catch (err) {
      console.error(err);
      alert("Error borrando la foto");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px", background: "#f7f8fa", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>🖼️ Admin - Fotos</h1>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <a
          href={config.urlQR || "/qr"}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: "10px 20px", background: "#0070f3", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}
        >
          🔳 Generar QR
        </a>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("pendientes")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            background: activeTab === "pendientes" ? "#0070f3" : "#e0e0e0",
            color: activeTab === "pendientes" ? "#fff" : "#555",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          Pendientes
        </button>

        <button
          onClick={() => setActiveTab("aprobadas")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            background: activeTab === "aprobadas" ? "#0070f3" : "#e0e0e0",
            color: activeTab === "aprobadas" ? "#fff" : "#555",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          Aprobadas
        </button>
      </div>

      {activeTab === "pendientes" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px", justifyItems: "center" }}>
          {pendingPhotos.length === 0 && <p style={{ color: "#555" }}>No hay fotos pendientes</p>}

          {pendingPhotos.map((photo, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <img src={photo.url} alt={`Pendiente ${idx + 1}`} style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "12px", boxShadow: "0 3px 6px rgba(0,0,0,0.1)" }} />
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
                <button onClick={() => aprobarFoto(photo.public_id)} style={{ padding: "5px 10px", background: "#28a745", color: "#fff", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                  Aprobar
                </button>
                <button onClick={() => rechazarFoto(photo.public_id)} style={{ padding: "5px 10px", background: "#dc3545", color: "#fff", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "aprobadas" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px", justifyItems: "center" }}>
          {approvedPhotos.length === 0 && <p style={{ color: "#555" }}>No hay fotos aprobadas</p>}

          {approvedPhotos.map((photo, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <img src={photo.url} alt={`Aprobada ${idx + 1}`} style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "12px", boxShadow: "0 3px 6px rgba(0,0,0,0.1)" }} />
              <button onClick={() => borrarFoto(photo.public_id)} style={{ marginTop: "5px", padding: "5px 10px", background: "#dc3545", color: "#fff", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                Borrar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
