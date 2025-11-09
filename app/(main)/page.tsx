import AboutSection from "@/Components/sections/AboutSection";
import ContactSection from "@/Components/sections/ContactSection";
import HeroSection from "@/Components/sections/HeroSection";
import JoinSection from "@/Components/sections/JoinSection";
import ServicesSection from "@/Components/sections/ServicesSection";
import WorkSection from "@/Components/sections/WorkSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <JoinSection />
      <ContactSection />
      <div className="flex justify-center my-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 40"
          className="w-[150px] md:w-[200px] h-auto">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#53CED6" />
              <stop offset="100%" stopColor="#B9ECEF" />
            </linearGradient>
          </defs>
          <path
            d="M0 10 Q10 0 20 10 T40 10 T60 10 T80 10 T100 10 T120 10 T140 10 T160 10 T180 10 T200 10
         M0 20 Q10 10 20 20 T40 20 T60 20 T80 20 T100 20 T120 20 T140 20 T160 20 T180 20 T200 20
         M0 30 Q10 20 20 30 T40 30 T60 30 T80 30 T100 30 T120 30 T140 30 T160 30 T180 30 T200 30"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
