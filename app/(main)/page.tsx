export const revalidate = 3600; // Revalidate static home every hour

import {
  AboutSection,
  ContactSection,
  HeroSection,
  JoinSection,
  ServicesSection,
  WorkSection,
} from "@/Components";

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
