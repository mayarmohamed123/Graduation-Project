import AboutSection from "@/Components/sections/AboutSection";
import HeroSection from "@/Components/sections/HeroSection";
import ServicesSection from "@/Components/sections/ServicesSection";

export default function Home() {
  return (
    <h1>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
    </h1>
  );
}
