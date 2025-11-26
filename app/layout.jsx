import config from "../config.json"; // <<-- sube un nivel

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "sans-serif",
          backgroundColor: config.fondo,
          color: "white",
        }}
      >
        {children}
      </body>
    </html>
  );
}
