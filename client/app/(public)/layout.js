export default function PublicLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      {children}
    </div>
  );
}
