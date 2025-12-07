import "../globals.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
      <Footer />
    </ProtectedRoute>
  );
}
