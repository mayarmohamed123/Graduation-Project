import AboutSection from "@/components/features/sections/AboutSection";
import ContactSection from "@/components/features/sections/ContactSection";
import HeroSection from "@/components/features/sections/HeroSection";
import JoinSection from "@/components/features/sections/JoinSection";
import ServicesSection from "@/components/features/sections/ServicesSection";
import WorkSection from "@/components/features/sections/WorkSection";

export const revalidate = 3600; // Revalidate static home every hour



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
