import "../../globals.css";
import Navbar from "@/Components/layout/navbar";
import Footer from "@/Components/layout/footer";
import { ProtectedRoute } from "@/Components/auth";

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
