import AboutSection from "@/Components/sections/AboutSection";
import ContactSection from "@/Components/sections/ContactSection";
import HeroSection from "@/Components/sections/HeroSection";
import JoinSection from "@/Components/sections/JoinSection";
import ServicesSection from "@/Components/sections/ServicesSection";
import WorkSection from "@/Components/sections/WorkSection";

export default function Home() {
  return (
    <h1>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <JoinSection />
      <ContactSection />
    </h1>
  );
}
