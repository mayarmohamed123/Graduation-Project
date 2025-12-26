import AboutSection from "@/Components/features/sections/AboutSection";
import ContactSection from "@/Components/features/sections/ContactSection";
import HeroSection from "@/Components/features/sections/HeroSection";
import JoinSection from "@/Components/features/sections/JoinSection";
import ServicesSection from "@/Components/features/sections/ServicesSection";
import WorkSection from "@/Components/features/sections/WorkSection";

export const revalidate = 0; // Disable cache



export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <JoinSection />
      <ContactSection />
    </div>
  );
}
