'use client';

import { useState } from 'react';
import { PricingCard } from './PricingCard';

interface PricingData {
  title: string;
  price: string;
  badge?: string;
  features: string;
  imageSrc: string;
  imageAlt: string;
}

export function PricingSection() {
  const [activeTab, setActiveTab] = useState<'trial' | 'notrial' | 'annual'>('trial');

  // Pricing data for each tab
  const pricingData: Record<'trial' | 'notrial' | 'annual', PricingData[]> = {
    trial: [
      {
        title: "NUTRITION ONLY",
        price: "€35/mo",
        badge: "FREE 1ST WEEK",
        imageSrc: "/images/pricing_01.png",
        imageAlt: "Nutrition Plan Jar",
        features: "E-Book, nutrition chapters, recipes, community access"
      },
      {
        title: "FITNESS ONLY",
        price: "€35/mo",
        badge: "FREE 1ST WEEK",
        imageSrc: "/images/pricing_02.png",
        imageAlt: "Fitness Plan Kettlebell",
        features: "E-Book, workout chapters, story content, community access"
      },
      {
        title: "BOTH COMBINED",
        price: "€40/mo",
        badge: "FREE 1ST WEEK",
        imageSrc: "/images/pricing_03.png",
        imageAlt: "Combined Nutrition and Fitness Plan",
        features: "E-Book with combined chapters, recipes & workouts, community access"
      }
    ],
    notrial: [
      {
        title: "NUTRITION ONLY",
        price: "€30/mo",
        imageSrc: "/images/pricing_01.png",
        imageAlt: "Nutrition Plan Jar",
        features: "48 chapters, deeper support, bonus recipes, starter kit, community"
      },
      {
        title: "FITNESS ONLY",
        price: "€30/mo",
        imageSrc: "/images/pricing_02.png",
        imageAlt: "Fitness Plan Kettlebell",
        features: "48 chapters, progress tracking, bonus workouts, starter kit, community"
      },
      {
        title: "BOTH COMBINED",
        price: "€35/mo",
        imageSrc: "/images/pricing_03.png",
        imageAlt: "Combined Nutrition and Fitness Plan",
        features: "Full coaching experience: comic + recipes + workouts + bonus challenges, community & worthy mascot support"
      }
    ],
    annual: [
      {
        title: "NUTRITION ONLY",
        price: "€35/mo",
        imageSrc: "/images/pricing_01.png",
        imageAlt: "Nutrition Plan Jar",
        features: "24 chapters, story with nutrition focus, 80s-style starter kit, community"
      },
      {
        title: "FITNESS ONLY",
        price: "€35/mo",
        imageSrc: "/images/pricing_02.png",
        imageAlt: "Fitness Plan Kettlebell",
        features: "24 chapters, training-focused story, starter kit, community"
      },
      {
        title: "BOTH COMBINED",
        price: "€40/mo",
        imageSrc: "/images/pricing_03.png",
        imageAlt: "Combined Nutrition and Fitness Plan",
        features: "Full storyline with workouts & recipes, starter kit, community access"
      }
    ]
  };

  const currentPricing = pricingData[activeTab];

  return (
    <section id="pricing" className="w-[calc(100%-40px)] m-auto bg-[#30D5C8] rounded-[120px] max-[1024px]:rounded-[50px]">
      <div className="mx-auto w-full max-w-[1600px] flex flex-col relative overflow-hidden py-[155px] px-[20px] max-[768px]:px-[10px] max-[1024px]:py-[80px] items-center text-center">
        
        {/* Section Header */}
        <span className="text-caps-14-smbld py-[4px] px-[12px] rounded-full bg-white mb-[25px] max-[768px]:mb-[15px]">
          PLANS & PRICING
        </span>

        <h2 className="max-w-[1500px] text-h2-01  text-white mb-[100px] max-[1200px]:mb-[75px] max-[768px]:!text-[38px]">
          One story. Three ways to experience it.
        </h2>

       {/* Plan Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <button
            onClick={() => setActiveTab('trial')}
            className={`text-caps-26-smbld px-[22px] py-[4px] rounded-full uppercase transition-all cursor-pointer border-2 ${
              activeTab === 'trial'
                ? 'bg-white text-[#1A1A1A] border-white'
                : 'border-white/60 text-white/60 hover:text-white hover:border-white'
            }`}
          >
            6MONTH + 1W FREE
          </button>

          <button
            onClick={() => setActiveTab('notrial')}
            className={`text-caps-26-smbld px-[22px] py-[4px] rounded-full uppercase transition-all cursor-pointer border-2 ${
              activeTab === 'notrial'
                ? 'bg-white text-[#1A1A1A] border-white'
                : 'border-white/60 text-white/60 hover:text-white hover:border-white'
            }`}
          >
            6MONTH NO TRIAL
          </button>

          <button
            onClick={() => setActiveTab('annual')}
            className={`text-caps-26-smbld px-[22px] py-[4px] rounded-full uppercase transition-all cursor-pointer border-2 ${
              activeTab === 'annual'
                ? 'bg-white text-[#1A1A1A] border-white'
                : 'border-white/60 text-white/60 hover:text-white hover:border-white'
            }`}
          >
            12-MONTH MEMBERSHIP
          </button>
        </div>

        {/* The 3 Core Pricing Cards - No animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] max-[1024px]:gap-y-[60px] w-full items-stretch">
          {currentPricing.map((card, index) => {
            // Check if it's the last item (index 2) on medium screens (md) where it breaks to a new row alone
            const isLastOnTablet = index === 2;

            return (
              <div 
                key={`${activeTab}-${index}`} 
                className={isLastOnTablet ? 'md:col-span-full lg:col-span-1 md:max-w-[calc(500px)] md:mx-auto w-full' : 'w-full'}
              >
                <PricingCard
                  title={card.title}
                  price={card.price}
                  badge={card.badge}
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  features={card.features}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}