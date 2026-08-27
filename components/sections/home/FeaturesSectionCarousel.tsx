'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FeatureSliderCard, Feature } from './FeatureSliderCard';
import type { EmblaCarouselType } from 'embla-carousel';

const FEATURES_DATA: (Feature & { icon: string })[] = [
  {
    id: 1,
    icon: '🌍',
    title: "CHOOSE STORY WORLD & UNLOCK CHAPTERS",
    description: [
      "Your journey begins the moment you pick your world — Fantasy, Retro, Magic, or Adventure. Each universe has its own tone, rhythm, and energy — and shapes how your workouts, recipes, and story unfold.",
      "Every week, you'll unlock a new chapter designed just for your world.",
      "From glowing spells to retro dance-offs or heroic missions, your path evolves with you — physically and emotionally."
    ],
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    icon: '📖',
    title: "YOUR OWN COMIC BOOK",
    description: [
      "Your story deserves to be told — and we made it epic.",
      "With every step you take in real life, your personalized comic evolves alongside you. Each chapter is illustrated, adapted to your choices, and reflects your weekly growth — mentally, physically, and emotionally.",
      "This isn't just a program. It's a story you live and shape — one workout at a time."
    ],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    icon: '🦸‍♀️',
    title: "PERSONALIZED COMIC AVATAR",
    description: [
      "We take your full-body photo and turn it into your comic heroine — YOU, drawn in the style of your selected world.",
      "As your story progresses, your avatar evolves too — glowing brighter, standing taller, becoming more powerful.",
      "She's not a character. She's your reflection, your goal, and your reminder: you're already the main character."
    ],
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    icon: '💪',
    title: "WORKOUTS TAILORED TO YOUR WORLD",
    description: [
      "No generic plans here.",
      "Your workouts are designed to match the energy, setting, and goals of your selected story world. Every chapter includes sessions that feel like you — aligned with your mood, capacity, and rhythm.",
      "You train, not just to sweat — but to progress in your story."
    ],
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    icon: '🍽️',
    title: "SIMPLE, STORY-LINKED RECIPES",
    description: [
      "Eat to fuel your glow — with food that fits your world and your lifestyle.",
      "Each chapter includes 1–3 easy, energizing recipes: from 'Power-Up Potions' to 'Recovery Plates.'",
      "No stress, no rules — just nourishment that supports your body and keeps your mission moving forward."
    ],
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    icon: '💬',
    title: "ACCESS TO THE WHATSAPP COMMUNITY",
    description: [
      "You don't have to glow alone.",
      "Join a safe, fun, supportive WhatsApp group full of other WORTHFIT women walking their own journeys.",
      "Expect encouragement, monthly challenges, surprise check-ins from Steffi, and lots of girl power."
    ],
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    icon: '🎁',
    title: "RETRO STARTER KIT (FOR FULL MEMBERSH.)",
    description: [
      "Sign up for a full membership and we'll send a little magic your way — straight to your doorstep.",
      "Think retro wristbands, iconic 80s stickers, a mini progress journal, and surprise glow-boosting goodies — all designed to bring the WORTHFIT world into your real space."
    ],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
  }
];

// How aggressively side slides shrink/fade. Lower = subtler.
const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);

export default function FeaturesSectionCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    containScroll: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla-tween-target') as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  // The core fix: continuously compute scale/opacity from real scroll
  // progress (including loop wrap points) instead of a binary "isActive"
  // flag toggled by state. This removes the jump/snap at the loop boundary.
  const tweenScale = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0.86, 1);
        const opacity = numberWithinRange(tweenValue, 0.55, 1);
        const node = tweenNodes.current[slideIndex];
        if (node) {
          node.style.transform = `scale(${scale})`;
          node.style.opacity = String(opacity);
        }
      });
    });
  }, []);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);
    onSelect(emblaApi);

    emblaApi
      .on('select', onSelect)
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('reInit', onSelect)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale);

    return () => {
      emblaApi
        .off('select', onSelect)
        .off('reInit', setTweenNodes)
        .off('reInit', setTweenFactor)
        .off('reInit', tweenScale)
        .off('reInit', onSelect)
        .off('scroll', tweenScale)
        .off('slideFocus', tweenScale);
    };
  }, [emblaApi, onSelect, setTweenNodes, setTweenFactor, tweenScale]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="w-full bg-[#ff5c97] py-16 overflow-hidden">
      <div className="w-full flex flex-col items-center">

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-wider text-white mb-10 text-center px-4">
          WHAT YOU&apos;LL GET:
        </h2>

        {/* Top Thumbnail Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-5xl px-4">
          {FEATURES_DATA.map((feature, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={feature.id}
                onClick={() => scrollTo(index)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-colors duration-200 border-2 ${
                  isSelected
                    ? 'bg-white text-[#1b1b1b] border-white shadow-lg'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                } w-[110px] md:w-[130px] h-[85px]`}
              >
                <span className="text-lg mb-1">{feature.icon}</span>
                <span className="text-[10px] md:text-[11px] font-bold uppercase text-center leading-tight line-clamp-2">
                  {feature.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Full-Width Carousel Wrapper */}
        <div className="relative w-full px-4 md:px-12">

          <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full" ref={emblaRef}>
            <div className="flex -ml-4 items-center py-6">
              {FEATURES_DATA.map((feature) => (
                <div
                  key={feature.id}
                  className="flex-[0_0_85%] md:flex-[0_0_750px] pl-4 min-w-0"
                >
                  {/* tween target: scale/opacity are set imperatively every
                      frame in tweenScale(), so no React re-render and no
                      CSS transition fighting embla's own transform */}
                  <div className="embla-tween-target will-change-transform">
                    <FeatureSliderCard feature={feature} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white/60 text-white flex items-center justify-center font-bold text-xl transition-all shadow-md backdrop-blur-sm"
            aria-label="Previous slide"
          >
            &larr;
          </button>

          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white/60 text-white flex items-center justify-center font-bold text-xl transition-all shadow-md backdrop-blur-sm"
            aria-label="Next slide"
          >
            &rarr;
          </button>

        </div>

      </div>
    </section>
  );
}