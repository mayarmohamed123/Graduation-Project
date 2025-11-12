import "../globals.css";
import { Footer, Navbar } from "@/Components/layout";
import ProtectedRoute from "@/Components/auth/ProtectedRoute";

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
