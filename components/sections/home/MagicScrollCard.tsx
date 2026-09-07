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
      className="absolute inset-0 overflow-hidden rounded-[60px] border-[15px] max-[1024px]:border-[8px] border-[#e6e6e6] bg-[#f3f3f3] max-h-[400px] max-md:max-h-[435px] max-md:h-auto"
    >
      {/* Desktop / tablet layout (≥768px) */}
      <div className="hidden md:flex h-full">
        <div className="flex w-[60%] flex-col justify-between gap-4 p-[45px] max-[1024px]:pr-[20px] max-w-[372px]">
          <h3 className="text-h4-02 uppercase">{data.title}</h3>
          <p className="text-body-16 text-[#1a1a1a]/80">{data.description}</p>
        </div>

        <div
          className="absolute right-0 top-0 bottom-0 w-[40%] bg-[#e6e6e6]"
          style={{ clipPath: "polygon(18% 0%, 22% 0%, 4% 100%, 0% 100%)" }}
        />

        <div
          className="absolute right-0 top-0 bottom-0 w-[40%]"
          style={{ clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 4% 100%)" }}
        >
          <Image src={data.image} alt={data.title} fill className="object-cover" sizes="40vw" />
        </div>
      </div>

      {/* Mobile layout (<768px) — image on top, diagonal bottom edge, text below */}
      <div className="flex md:hidden flex-col h-[435px]">
        <div className="relative w-full h-[186px] min-[501px]:h-[218px] shrink-0">
          {/* Bottom border layer — full diagonal shape, sits behind image */}
          <div
            className="absolute inset-0 bg-[#e6e6e6]"
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 72.31%)" }}
          />

          {/* Image layer — same diagonal, pulled up 8px so only bottom edge peeks through */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% calc(100% - 8px), 0% calc(72.31% - 8px))",
            }}
          >
            <Image src={data.image} alt={data.title} fill className="object-cover object-top" sizes="100vw" />
          </div>
        </div>

        <div className="flex flex-col gap-4 p-[24px] pt-[0px]">
          <h3 className="text-h4-02 uppercase">{data.title}</h3>
          <p className="text-body-16 !text-[14px] text-[#1a1a1a]/80">{data.description}</p>
        </div>
      </div>
    </div>
  );
}