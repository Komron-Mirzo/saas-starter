'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FeatureSliderCard, Feature } from './FeatureSliderCard';
import type { EmblaCarouselType } from 'embla-carousel';

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);

interface Props {
  features: (Feature & { icon: string })[];
}

export default function FeaturesClientCarousel({ features }: Props) {
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
        const scale = numberWithinRange(tweenValue, 0.718, 1);
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
    <section className="w-full bg-[#FF7DA8] py-[155px]">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-h1-02 text-white mb-[40px]">
          WHAT YOU&apos;LL GET:
        </h2>

        {/* Top Thumbnail Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-[15px] mb-8">
          {features.map((feature, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={feature.id}
                onClick={() => scrollTo(index)}
                className={`flex flex-col items-center justify-center p-[17px] rounded-[25px] transition-colors duration-200 gap-[6px] ${
                  isSelected
                    ? 'bg-white text-[#1b1b1b] shadow-lg'
                    : 'bg-white/25 text-white hover:bg-white/35'
                } w-[173px] h-[124px]`}
              >
                {feature.icon.startsWith('http') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={feature.icon}
                    alt=""
                    className={`w-[30px] h-[30px] object-contain transition-all ${
                      isSelected ? '' : 'brightness-0 invert'
                    }`}
                  />
                ) : (
                  <span className="text-caps-14-smbld">{feature.icon}</span>
                )}
                <span className="text-caps-14-smbld">
                  {feature.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Full-Width Carousel Wrapper with Responsive Gap-Centered Arrows */}
        <div className="relative w-full mx-auto flex items-center justify-center">
          
          {/* Previous Arrow - Fluidly clamped to exact center of left gap */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-[calc(50%-clamp(300px,32vw,665.5px))] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white hover:scale-110 transition-transform"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="30" fill="none" viewBox="0 0 19 30">
              <path fill="#fff" fillOpacity=".7" d="m14.768 0 3.535 3.535L7.07 14.768 18.303 26l-3.535 3.535L0 14.768z"/>
            </svg>
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full" ref={emblaRef}>
            <div className="flex -ml-4 items-center py-6">
              {features.map((feature) => (
                <div 
                  key={feature.id} 
                  className="flex-[0_0_85%] md:flex-[0_0_clamp(500px,53.9vw,1035px)] pl-4 min-w-0 transition-all"
                >
                  <div className="embla-tween-target will-change-transform">
                    <FeatureSliderCard feature={feature} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow - Fluidly clamped to exact center of right gap */}
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-[calc(50%-clamp(300px,32vw,665.5px))] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white hover:scale-110 transition-transform"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="30" fill="none" viewBox="0 0 19 30">
              <path fill="#fff" fillOpacity=".7" d="M3.537 0 .002 3.535l11.232 11.233L.002 26l3.535 3.535 14.768-14.767z"/>
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
}