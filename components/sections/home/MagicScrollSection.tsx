"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StackCard, { CardData } from "./MagicScrollCard";

gsap.registerPlugin(ScrollTrigger);

const ENTRY_SPAN = 0.4;
const STEP_ROTATE = 4;
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
          const flatIndex = Math.floor(rawIndex);
          const enteringFrac = gsap.utils.clamp(0, 1, (rawIndex - flatIndex) / ENTRY_SPAN);
          setActiveIndex(Math.min(TOTAL - 1, flatIndex));
          cards.forEach((_, i) => {
            const el = cardRefs.current[i];
            if (!el) return;
            const entryT = gsap.utils.clamp(0, 1, (rawIndex - i) / ENTRY_SPAN);
            const stacked = Math.max(0, flatIndex - i - 1);
            const depth = gsap.utils.clamp(
              0,
              MAX_DEPTH,
              stacked + (flatIndex > i ? enteringFrac : 0)
            );
            gsap.set(el, {
              transformOrigin: "center",
              yPercent: gsap.utils.interpolate(40, 0, entryT),
              opacity: entryT,
              rotate: -i * STEP_ROTATE,
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
    <section ref={sectionRef} className="relative pb-[260px] bg-[#F3F3F3] overflow-hidden">
      <div
        ref={pinRef}
        className="relative flex min-h-[813px] max-h-[1213px] w-full items-center justify-center"
      >
        <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
          <span className="text-h1-01 !text-[42vw] leading-none text-[#D9D9D9] ">
            {cards[activeIndex]?.number || "01"}
          </span>
        </div>
        <div className="relative h-[60vh] w-full max-w-[834px] max-h-[564px] -mb-[434px]">
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