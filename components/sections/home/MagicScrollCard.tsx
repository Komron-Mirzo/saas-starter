// StackCard.tsx
"use client";

import Image from "next/image";

export type CardData = {
  number: string;
  title: string;
  description: string;
  image: string;
};

type StackCardProps = {
  data: CardData;
  index: number;
  setRef: (el: HTMLDivElement | null) => void;
};

export default function StackCard({ data, index, setRef }: StackCardProps) {
  return (
    <div
      ref={setRef}
      style={{ zIndex: index }}
      className="absolute inset-0 flex overflow-hidden rounded-[60px] border-[15px] border-[#e6e6e6] bg-[#f3f3f3] max-h-[400px]"
    >
      {/* Left Text Container (60%) */}
      <div className="flex w-[60%] flex-col justify-center gap-4 pl-12 pr-6 py-10">
        <h3 className="whitespace-pre-line text-3xl font-extrabold leading-tight">
          {data.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600">{data.description}</p>
      </div>

      {/* Border wrapper that creates the slanted stroke effect */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[40%] bg-[#e6e6e6]"
        style={{
          clipPath: "polygon(18% 0%, 22% 0%, 4% 100%, 0% 100%)"
        }}
      />
      
      {/* Right Image Container (Exactly 40% with Slanted Clip-Path) */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[40%]"
        style={{
          clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 4% 100%)"
        }}
      >
        <Image src={data.image} alt={data.title} fill className="object-cover" sizes="40vw" />
      </div>
    </div>
  );
}