"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Total scroll length the section consumes while pinned.
 * Section height = 100vh (pinned viewport) + this value.
 * Increase to slow the animation down, decrease to speed it up.
 */
const SCROLL_VH = 400;

export default function WorthfitScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const girl01Ref = useRef<HTMLImageElement>(null);
  const girl02Ref = useRef<HTMLImageElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ---- initial state ----
      gsap.set(girl01Ref.current, { opacity: 1 });
      gsap.set(girl02Ref.current, { opacity: 0 });
      gsap.set(bubbleRef.current, { opacity: 0, scale: 0 });
      gsap.set(leftWrapRef.current, { yPercent: 0 });

      // Timeline runs on an arbitrary 0–12 scale, scrubbed 1:1 with scroll
      // progress across SCROLL_VH. Transitions are given a MUCH bigger
      // share of the timeline than the holds, and use ease:"none" so the
      // motion is directly tied to scroll position (no easing-induced
      // "snap" once you're mid-scroll) — only the hold pauses give you a
      // moment to read before the next transition begins.
      //
      // 0.0 – 0.5   hold  A-1
      // 0.5 – 3.5   move  A-1 -> A-2   (3 units — slow, continuous)
      // 3.5 – 4.5   hold  A-2
      // 4.5 – 7.5   move  A-2 -> A-3   (3 units — slow, continuous)
      // 7.5 – 8.5   hold  A-3
      // 8.5 – 10.5  bubble scales in / steffy crossfades
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${SCROLL_VH}%`,
          scrub: 0.5,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // markers: true, // uncomment while tuning
        },
      });

      // A-1 -> A-2
      tl.to(leftWrapRef.current, { yPercent: -33.333, duration: 3 }, 0.5)
        .to(girl01Ref.current, { opacity: 0, duration: 3, ease: "sine.inOut" }, 0.5)
        .to(girl02Ref.current, { opacity: 1, duration: 3, ease: "sine.inOut" }, 0.5);

      // A-2 -> A-3
      tl.to(leftWrapRef.current, { yPercent: -66.666, duration: 3 }, 4.5)
        .to(girl02Ref.current, { opacity: 0, duration: 3, ease: "sine.inOut" }, 4.5)
        .to(girl01Ref.current, { opacity: 1, duration: 3, ease: "sine.inOut" }, 4.5);

      // Bubble in, steffy crossfades to girl-02 one last time
      tl.to(
        bubbleRef.current,
        { opacity: 1, scale: 1, duration: 2, ease: "power1.out" },
        8.5
      )
        .to(girl01Ref.current, { opacity: 0, duration: 2, ease: "sine.inOut" }, 8.5)
        .to(girl02Ref.current, { opacity: 1, duration: 2, ease: "sine.inOut" }, 8.5);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#1a1a1a]"
      style={{ height: `calc(100vh + ${SCROLL_VH}vh)` }}
    >
      <div
        ref={pinRef}
        className="absolute inset-0 h-screen w-full overflow-hidden"
      >
        <div className="mx-auto flex h-full w-full max-w-[1560px] items-center justify-between px-6 md:px-10 lg:px-16">
          {/* ---------------- A) LEFT: scrolling text stack ---------------- */}
          {/* Outer clip box stays a normal 1x-screen box; the track inside
              it is forced to exactly 3x that height (300%) with each panel
              at exactly 1/3 (33.3333%). That makes the track's own bounding
              box 3 sections tall, so yPercent -33.333 / -66.666 move it by
              exactly one full section each time instead of a fraction of
              one screen. */}
          <div className="relative h-full w-full max-w-[717px] overflow-hidden">
            <div ref={leftWrapRef} className="h-[300%] w-full">
              {/* A-1 */}
              <div className="flex h-[33.3333%] w-full flex-col justify-center">
                <div className="flex flex-col gap-[25px]">
                  <span className="text-caps-14-smbld inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-[#1a1a1a]">
                    WHAT IS WORTHFIT?
                  </span>
                  <h2 className="text-h1-02 italic uppercase text-[#FF7DA8]">
                    Worthfit is not a program.
                    <br />
                    It&rsquo;s your personal universe.
                  </h2>
                </div>
              </div>

              {/* A-2 */}
              <div className="flex h-[33.3333%] w-full flex-col justify-center gap-[28px]">
                <p className="text-body-28 text-white">
                  WORTHFIT combines fitness and nutrition with the magic of
                  story.
                </p>
                <p className="text-body-28 text-white">
                  You&rsquo;re not just working out — you&rsquo;re becoming
                  the heroine of your own comic adventure. Every chapter
                  brings new workouts, recipes, and motivation — all
                  personalized to your journey.
                </p>
              </div>

              {/* A-3 */}
              <div className="flex h-[33.3333%] w-full flex-col justify-center gap-[25px]">
                <h2 className="text-h1-02 italic uppercase text-[#FF7DA8]">
                  No rules.
                  <br />
                  No pressure.
                </h2>
                <p className="text-body-28 text-white">
                  Just a story that grows with you — and a body that follows.
                </p>
              </div>
            </div>
          </div>

          {/* ---------------- B) RIGHT: fixed graphic ---------------- */}
          <div className="pointer-events-none relative flex h-full flex-1 items-center justify-center">
            <div className="relative w-[clamp(320px,40vw,629px)]">
              <img
                ref={girl01Ref}
                src="/images/steffy-girl-01.svg"
                alt=""
                className="h-auto w-full"
                draggable={false}
              />
              <img
                ref={girl02Ref}
                src="/images/steffy-girl-02.svg"
                alt=""
                className="absolute inset-0 h-auto w-full"
                draggable={false}
              />

              {/* Speech bubble — position tuned relative to her head/mouth.
                  Adjust top/right % to match the exact art. */}
              <div
                ref={bubbleRef}
                className="absolute right-[4%] top-[2%] w-[clamp(140px,18vw,257px)] origin-bottom-left"
              >
                <img
                  src="/images/steffy-bubble-speech.svg"
                  alt=""
                  className="h-auto w-full"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}