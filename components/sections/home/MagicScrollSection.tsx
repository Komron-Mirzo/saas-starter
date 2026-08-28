// CardStack.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StackCard, { CardData } from "./StackCard";

gsap.registerPlugin(ScrollTrigger);

const cards: CardData[] = [
  {
    number: "01",
    title: "UNLOCK YOUR\nPOWER PATH",
    description:
      "Is your strength in movement, nourishment, or both? Choose Fitness, Nutrition, or the full combo — and we'll shape your comic journey to reflect your personal power.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
  },
  {
    number: "02",
    title: "MEET YOUR\nINNER HEROINE",
    description:
      "This is where it all begins. Answer a few fun, personal questions to start shaping your story. You'll later upload a full-body and face photo — so we can create your personalized comic avatar that truly looks like YOU.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
  },
  {
    number: "03",
    title: "PICK YOUR\nSTORY WORLD",
    description:
      "Adventure. Fantasy. Magic. Retro. Each world is a universe of its own — filled with color, challenges, and wonder. Choose the one that calls to you, and become the heroine it's been waiting for.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
  },
  {
    number: "04",
    title: "LET YOUR PROGRESS\nSHAPE THE PLOT",
    description:
      "Every rep, every recipe, every choice moves the story forward. Track your progress, unlock surprises, and earn fun rewards. Each week brings a new chapter — written by your actions.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  },
];

const TOTAL = cards.length;

// --- tuning knobs, all in "card units" or px/deg ---
const ENTRY_SPAN = 0.4; // fraction of a card's segment spent sliding up + fading in
const STEP_X = 18; // px shift right per stacked level behind the active card
const STEP_Y = 16; // px shift down per stacked level
const STEP_ROTATE = 4; // deg rotation per stacked level (alternates direction by index)
const STEP_SCALE = 0.035; // scale shrink per stacked level
const MAX_DEPTH = TOTAL - 1; // a card can never recede more levels than cards behind it

export default function CardStack() {
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
          const rawIndex = self.progress * TOTAL; // continuous "which card" position, 0..TOTAL

          setActiveIndex(Math.min(TOTAL - 1, Math.floor(rawIndex)));

          cards.forEach((_, i) => {
            const el = cardRefs.current[i];
            if (!el) return;

            // 0 -> 1 over this card's own entry window (slide up + fade in)
            const entryT = gsap.utils.clamp(0, 1, (rawIndex - i) / ENTRY_SPAN);

            // grows continuously as later cards enter on top of this one
            const depth = gsap.utils.clamp(
              0,
              MAX_DEPTH,
              rawIndex - i - ENTRY_SPAN
            );

            const dir = i % 2 === 0 ? 1 : -1;

            gsap.set(el, {
              yPercent: gsap.utils.interpolate(60, 0, entryT),
              opacity: entryT,
              x: depth * STEP_X,
              y: depth * STEP_Y,
              rotate: depth * STEP_ROTATE * dir,
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
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div
        ref={pinRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-100"
      >
        <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
          <span className="text-[55vw] font-black leading-none text-neutral-300/70 md:text-[42vw]">
            {cards[activeIndex].number}
          </span>
        </div>

        <div className="relative h-[60vh] w-full max-w-3xl">
          {cards.map((card, i) => (
            <StackCard
              key={card.number}
              data={card}
              index={i}
              setRef={(el) => (cardRefs.current[i] = el)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}