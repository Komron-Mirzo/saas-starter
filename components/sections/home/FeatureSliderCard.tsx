import React from 'react';
import Image from 'next/image';

export type Feature = {
  id: number;
  title: string;
  description: string[];
  imageUrl: string;
};

interface FeatureSliderCardProps {
  feature: Feature;
}

export function FeatureSliderCard({ feature }: FeatureSliderCardProps) {
  return (
    <div className="w-full bg-white rounded-[40px] flex flex-col md:flex-row overflow-hidden shadow-xl">
      
      {/* Left Thumbnail/Illustration Part (approx 45% width) */}
      <div className="w-full md:w-[45%] p-6 relative flex items-center justify-center flex-shrink-0">
        <div className="w-full h-[280px] md:h-[340px] relative rounded-[30px] overflow-hidden bg-teal-400">
          <Image
            src={feature.imageUrl}
            alt={feature.title}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Content Part (approx 55% width) */}
      <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#1b1b1b] mb-4">
          {feature.title}
        </h3>
        
        <div className="flex flex-col gap-3 text-sm md:text-base text-[#1b1b1b]/80 font-normal leading-relaxed">
          {feature.description.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

    </div>
  );
}