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
      className="absolute inset-0 flex overflow-hidden rounded-3xl bg-white shadow-xl"
    >
      <div className="flex w-1/2 flex-col justify-center gap-4 p-10">
        <h3 className="whitespace-pre-line text-3xl font-extrabold leading-tight">
          {data.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600">{data.description}</p>
      </div>
      <div className="relative w-1/2">
        <Image src={data.image} alt={data.title} fill className="object-cover" sizes="50vw" />
      </div>
    </div>
  );
}