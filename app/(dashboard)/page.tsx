import { Hero } from '@/components/sections/home/Hero';
import { PricingSection } from '@/components/sections/home/PricingSection';
import { StaticPink } from '@/components/sections/home/StaticPinkSection';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Custom Hero Section based on your Figma design */}
      <Hero />
      <PricingSection />
      <StaticPink />

    </main>
  );
}