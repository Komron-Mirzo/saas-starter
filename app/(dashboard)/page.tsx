import { Hero } from '@/components/ui/Hero';
import { Footer } from '@/components/ui/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Custom Hero Section based on your Figma design */}
      <Hero />

      {/* You can add your next custom section right here as you build them, e.g.: */}
      {/* <StoryWorlds /> */}
      {/* <PricingSection /> */}

    </main>
  );
}