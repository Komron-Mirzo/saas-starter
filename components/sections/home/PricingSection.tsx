"use client";

import { useState } from 'react';
import { PricingCard } from './PricingCard';

export function PricingSection() {
  const [activeTab, setActiveTab] = useState<'trial' | 'notrial' | 'annual'>('trial');

  return (
    <section className="w-full bg-[#2ECABE] py-20 px-6 lg:px-12 rounded-[48px] max-w-[1870px] mx-auto my-12 relative overflow-hidden">
      <div className="max-w-[1560px] mx-auto flex flex-col items-center text-center">
        
        {/* Section Header */}
        <span className="text-xs font-black tracking-widest text-white uppercase bg-black/10 px-4 py-1.5 rounded-full mb-4 border border-black/10">
          PLANS & PRICING
        </span>

        <h2 className="max-w-[1500px] text-h2-01 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] mb-8 drop-shadow-sm">
          One story. Three ways to experience it.
        </h2>

        {/* Plan Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 bg-white/20 p-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_#1A1A1A] mb-16">
          <button
            onClick={() => setActiveTab('trial')}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'trial'
                ? 'bg-white text-gray-900 shadow-[2px_2px_0px_0px_#1A1A1A] border border-black'
                : 'text-white hover:text-white/80'
            }`}
          >
            6MONTH + 1W FREE
          </button>

          <button
            onClick={() => setActiveTab('notrial')}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'notrial'
                ? 'bg-white text-gray-900 shadow-[2px_2px_0px_0px_#1A1A1A] border border-black'
                : 'text-white hover:text-white/80'
            }`}
          >
            6MONTH NO TRIAL
          </button>

          <button
            onClick={() => setActiveTab('annual')}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'annual'
                ? 'bg-white text-gray-900 shadow-[2px_2px_0px_0px_#1A1A1A] border border-black'
                : 'text-white hover:text-white/80'
            }`}
          >
            12-MONTH MEMBERSHIP
          </button>
        </div>

        {/* The 3 Core Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
          
          {/* Card 1: Nutrition Only */}
          <PricingCard
            title="NUTRITION ONLY"
            price="€35/mo"
            badge="FREE 1ST WEEK"
            imageSrc="/images/pricing_01.png"
            imageAlt="Nutrition Plan Jar"
            features={[
              "E-Book, nutrition chapters, recipes,",
              "community access"
            ]}
          />

          {/* Card 2: Fitness Only */}
          <PricingCard
            title="FITNESS ONLY"
            price="€35/mo"
            badge="FREE 1ST WEEK"
            imageSrc="/images/pricing_02.png"
            imageAlt="Fitness Plan Kettlebell"
            features={[
              "E-Book, workout chapters, story content,",
              "community access"
            ]}
          />

          {/* Card 3: Both Combined */}
          <PricingCard
            title="BOTH COMBINED"
            price="€40/mo"
            badge="FREE 1ST WEEK"
            imageSrc="/images/pricing_03.png"
            imageAlt="Combined Nutrition and Fitness Plan"
            features={[
              "E-Book with combined chapters, recipes & workouts, community access"
            ]}
          />

        </div>

      </div>
    </section>
  );
}