import "../globals.css";
import Navbar from "@/Components/layout/navbar";
import Footer from "@/Components/layout/footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <>
      <Navbar />
      {children}
      <Footer />
    </>
    </>
  );
  
}
