import "../globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ProtectedRoute } from "@/components";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <ProtectedRoute>
      <Navbar />
      {children}
      <Footer />
    </ProtectedRoute>
    </>
  );
  
}
