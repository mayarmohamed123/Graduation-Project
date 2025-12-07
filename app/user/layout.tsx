import "../globals.css";
import { Footer, Navbar } from "@/components/layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
