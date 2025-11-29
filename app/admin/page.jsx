"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [approvedPhotos, setApprovedPhotos] = useState([]);

  const fetchPhotos = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch("/api/list-uploads?folder=pending"),
        fetch("/api/list-uploads?folder=approved"),
      ]);

      const pendingData = await pendingRes.json();
      const approvedData = await approvedRes.json();

      setPendingPhotos(pendingData.images || []);
      setApprovedPhotos(approvedData.images || []);
    } catch (error) {
      console.error("Error cargando fotos:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const aprobarFoto = async (publicId) => {
    try {
      const res = await fetch("/api/approve-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      fetchPhotos();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const rechazarFoto = async (publicId) => {
    try {
      const res = await fetch("/api/reject-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      fetchPhotos();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const borrarFoto = async (publicId) => {
    try {
      const res = await fetch("/api/delete-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      fetchPhotos();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {/* Pendientes */}
      <h2 className="text-2xl mb-4">Pendientes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pendingPhotos.map((photo) => (
          <div key={photo.public_id} className="border p-2 rounded">
            <Image
              src={photo.secure_url}
              width={300}
              height={300}
              className="rounded"
              alt=""
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => aprobarFoto(photo.public_id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Aprobar
              </button>

              <button
                onClick={() => rechazarFoto(photo.public_id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Aprobadas */}
      <h2 className="text-2xl mt-10 mb-4">Aprobadas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {approvedPhotos.map((photo) => (
          <div key={photo.public_id} className="border p-2 rounded">
            <Image
              src={photo.secure_url}
              width={300}
              height={300}
              className="rounded"
              alt=""
            />

            <button
              onClick={() => borrarFoto(photo.public_id)}
              className="bg-red-600 text-white px-3 py-1 mt-3 rounded"
            >
              Borrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
