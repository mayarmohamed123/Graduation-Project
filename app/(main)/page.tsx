export const revalidate = 3600; // Revalidate static home every hour

import {
  AboutSection,
  ContactSection,
  HeroSection,
  JoinSection,
  ServicesSection,
  WorkSection,
} from "@/components";

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
