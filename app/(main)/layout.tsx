import "../globals.css";
import LandingNavbar from "@/Components/layout/LandingNavbar";
import Footer from "@/Components/layout/footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingNavbar />
      {children}
      <Footer />
    </>
  );
}
