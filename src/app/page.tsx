import { HeroSection, CategoryShowcase, CTASection } from "@/components/home/HomeSections";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedEquipment />
      <CategoryShowcase />
      <CTASection />
    </>
  );
}
