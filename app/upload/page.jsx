"use client";
import { useState } from "react";

export default function UploadPage({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setFile(null);
        if (onUpload) onUpload();
        alert("¡Subido correctamente!");
      } else {
        alert("Error al subir la foto");
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f8fa",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "30px", color: "#333" }}>📤 Subir Foto</h1>

      <form
        onSubmit={handleSubmit}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <label
          htmlFor="fileInput"
          style={{
            padding: "40px",
            border: "2px dashed #0070f3",
            borderRadius: "12px",
            width: "100%",
            textAlign: "center",
            backgroundColor: dragActive ? "#e0f0ff" : "#fff",
            cursor: "pointer",
            transition: "background 0.2s",
            color: "#555",
          }}
        >
          {file ? file.name : "📁 Arrastra la foto aquí o haz clic"}
        </label>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "12px 25px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
          }}
        >
          {uploading ? "Subiendo..." : "Subir Foto"}
        </button>

        {file && <p style={{ color: "#555" }}>Archivo seleccionado: {file.name}</p>}
      </form>
    </div>
  );
}
