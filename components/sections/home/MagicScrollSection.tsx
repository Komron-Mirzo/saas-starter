"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StackCard, { CardData } from "./MagicScrollCard";

gsap.registerPlugin(ScrollTrigger);

const ENTRY_SPAN = 0.4; 
const STEP_X = 18; 
const STEP_Y = 16; 
const STEP_ROTATE = 2; 
const STEP_SCALE = 0.035; 

interface Props {
  cards: CardData[];
}

export default function CardStackClient({ cards }: Props) {
  const TOTAL = cards.length;
  const MAX_DEPTH = TOTAL - 1;

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: pinRef.current,
        start: "top top",
        end: () => `+=${(TOTAL - 1) * window.innerHeight}`,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const rawIndex = self.progress * TOTAL; 
          setActiveIndex(Math.min(TOTAL - 1, Math.floor(rawIndex)));

          cards.forEach((_, i) => {
            const el = cardRefs.current[i];
            if (!el) return;

            const entryT = gsap.utils.clamp(0, 1, (rawIndex - i) / ENTRY_SPAN);
            const depth = gsap.utils.clamp(0, MAX_DEPTH, rawIndex - i - ENTRY_SPAN);

            gsap.set(el, {
              transformOrigin: "bottom left",
              yPercent: gsap.utils.interpolate(40, 0, entryT),
              opacity: entryT,
              x: -depth * STEP_X,
              y: -depth * STEP_Y,
              rotate: -depth * STEP_ROTATE,
              scale: 1 - depth * STEP_SCALE,
              zIndex: i + 1,
            });
          });
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [cards, TOTAL, MAX_DEPTH]);

  return (
    <section ref={sectionRef} className="relative">
      <div
        ref={pinRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-100"
      >
        <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
          <span className="text-[55vw] font-black leading-none text-neutral-300/70 md:text-[42vw]">
            {cards[activeIndex]?.number || "01"}
          </span>
        </div>

        <div className="relative h-[60vh] w-full max-w-3xl">
          {cards.map((card, i) => (
            <StackCard
              key={card.number + i}
              data={card}
              index={i}
              setRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}