import "../globals.css";
import LandingNavbar from "@/components/layout/LandingNavbar";
import Footer from "@/components/layout/footer";


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
