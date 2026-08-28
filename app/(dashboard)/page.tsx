import CustomContactSection from '@/components/sections/home/CustomContactSection';
import FaqSection from '@/components/sections/home/FaqSection';
import { Hero } from '@/components/sections/home/Hero';
import { PricingSection } from '@/components/sections/home/PricingSection';
import { StaticPink } from '@/components/sections/home/StaticPinkSection';
import { sendContactEmail } from '@/app/(dashboard)/actions';
import TogetherSection from '@/components/sections/home/TogetherSection';
import ReviewSection from '@/components/sections/home/ReviewSection';
import FeaturesSectionCarousel from '@/components/sections/home/FeaturesSectionCarousel';
import BookReaderSection from '@/components/sections/home/BookReaderSection';
import MagicScrollSection from '@/components/sections/home/MagicScrollSection';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Custom Hero Section based on your Figma design */}
      <Hero />
      <FeaturesSectionCarousel />
      <PricingSection />
      <StaticPink />
      <ReviewSection />
      <BookReaderSection />
      <MagicScrollSection />
      <FaqSection />
      <CustomContactSection action={sendContactEmail} />
      <TogetherSection />

    </main>
  );
}