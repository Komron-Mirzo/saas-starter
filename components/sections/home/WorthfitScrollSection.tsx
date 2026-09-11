"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------------- Desktop (>=768px) pinned-scroll constants ----------------
const SCROLL_ANIMATION_VH = 300; 
const SCROLL_HOLD_VH = 100;    
const SCROLL_VH = SCROLL_ANIMATION_VH + SCROLL_HOLD_VH;

const TIMELINE_ANIMATION_UNITS = 9; 
const HOLD_UNITS =
  TIMELINE_ANIMATION_UNITS * (SCROLL_HOLD_VH / SCROLL_ANIMATION_VH);

const MOBILE_MQ = "(max-width: 767px)";
const DESKTOP_MQ = "(min-width: 768px)";

export default function WorthfitScrollSection() {
  // ----- desktop refs -----
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const girl01Ref = useRef<HTMLImageElement>(null);
  const girl02Ref = useRef<HTMLImageElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // ----- mobile refs -----
  const mobileRootRef = useRef<HTMLDivElement>(null);
  const mText1Ref = useRef<HTMLDivElement>(null);
  const mText2Ref = useRef<HTMLDivElement>(null);
  const mText3Ref = useRef<HTMLDivElement>(null);
  const mImageWrapRef = useRef<HTMLDivElement>(null);
  const mGirl01Ref = useRef<HTMLImageElement>(null);
  const mGirl02Ref = useRef<HTMLImageElement>(null);
  const mBubbleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // ================= DESKTOP: 3-step scroll sequence + 1 final hold =================
    mm.add(DESKTOP_MQ, () => {
      const ctx = gsap.context(() => {
        gsap.set(girl01Ref.current, { opacity: 1 });
        gsap.set(girl02Ref.current, { opacity: 0 });
        gsap.set(bubbleRef.current, { opacity: 0, scale: 0 });
        gsap.set(leftWrapRef.current, { yPercent: 0 });

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
          },
        });

        tl.to(leftWrapRef.current, { yPercent: -33.333, duration: 3 }, 0.5);

        tl.set(girl01Ref.current, { opacity: 0 }, 2.7)
          .set(girl02Ref.current, { opacity: 1 }, 2.7)
          .to(leftWrapRef.current, { yPercent: -66.666, duration: 3 }, 3);

        tl.set(girl01Ref.current, { opacity: 1 }, 5.7)
          .set(girl02Ref.current, { opacity: 0 }, 5.7);

        tl.to(bubbleRef.current, { opacity: 1, scale: 1, duration: 2, ease: "power1.out" }, 6);

        tl.set(girl01Ref.current, { opacity: 0 }, 7.4)
          .set(girl02Ref.current, { opacity: 1 }, 7.4);

        tl.to({}, { duration: HOLD_UNITS }, TIMELINE_ANIMATION_UNITS);
      }, sectionRef);

      return () => ctx.revert();
    });

    // ================= MOBILE: scroll-driven timeline on the image wrap container =================
    mm.add(MOBILE_MQ, () => {
      const ctx = gsap.context(() => {
        [mText1Ref, mText2Ref, mText3Ref].forEach((ref) => {
          gsap.set(ref.current, { opacity: 0, y: 32 });
          gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        // Set initial state explicitly
        gsap.set(mGirl01Ref.current, { opacity: 1 });
        gsap.set(mGirl02Ref.current, { opacity: 0 });
        gsap.set(mBubbleRef.current, { opacity: 0, scale: 0 });

        // Use a scroll-scrubbed timeline directly tied to the image wrap container viewport scroll
        const mTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: mImageWrapRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: true,
          },
        });

        // Step 1: Bubble scales up from 0 to 1
        mTl.to(mBubbleRef.current, { opacity: 1, scale: 1, duration: 1 })
           // Step 2: Once bubble hits 100% scale, switch image once
           .set(mGirl01Ref.current, { opacity: 0 }, "+=0")
           .set(mGirl02Ref.current, { opacity: 1 }, "+=0")
           // Small hold spacer so the change stays visible before scrolling past
           .to({}, { duration: 0.5 });

      }, mobileRootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* ================= DESKTOP (>=768px) ================= */}
      <section
        ref={sectionRef}
        id="what-is-worthfit"
        className="relative hidden w-full bg-[#1a1a1a] md:block"
        style={{ height: `calc(100vh + ${SCROLL_VH}vh)` }}
      >
        <div ref={pinRef} className="absolute inset-0 h-screen w-full overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[46.7vw] overflow-hidden"
            style={{
              backgroundImage: "url(/images/steffy-section-bg.svg)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center",
              backgroundSize: "auto 100%",
            }}
          />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1650px] items-center justify-between px-[45px] md:px-10 lg:px-16">
            <div className="relative h-full w-[47%] max-w-[717px] overflow-hidden">
              <div ref={leftWrapRef} className="h-[300%] w-full">
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

                <div className="flex h-[33.3333%] w-full flex-col justify-center gap-[28px]">
                  <p className="text-body-28 text-white">
                    WORTHFIT combines fitness and nutrition with the magic of story.
                  </p>
                  <p className="text-body-28 text-white">
                    You&rsquo;re not just working out — you&rsquo;re becoming the heroine of your
                    own comic adventure. Every chapter brings new workouts, recipes, and
                    motivation — all personalized to your journey.
                  </p>
                </div>

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

            <div className="pointer-events-none relative flex h-full w-[38%] flex-1 items-center justify-center">
              <div className="relative aspect-[629/768] w-full max-h-[768px] max-w-[629px] self-center">
                <img
                  ref={girl01Ref}
                  src="/images/steffy-girl-01.svg"
                  alt=""
                  className="h-full w-full object-contain"
                  draggable={false}
                />
                <img
                  ref={girl02Ref}
                  src="/images/steffy-girl-02.svg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                />
                <div
                  ref={bubbleRef}
                  className="absolute left-[0%] top-0 w-[clamp(140px,18vw,257px)] origin-bottom-left"
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

      {/* ================= MOBILE (<768px) ================= */}
      <div ref={mobileRootRef} className="block w-full bg-[#1a1a1a] px-[20px] pt-[100px] pb-[0px] md:hidden">
        <div className="mx-auto flex flex-col gap-[70px]">
          <div ref={mText1Ref} className="flex flex-col gap-[18px]">
            <span className="text-caps-14-smbld inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-[#1a1a1a]">
              WHAT IS WORTHFIT?
            </span>
            <h2 className="text-h1-02 italic uppercase text-[#FF7DA8]">
              Worthfit is not a program. It&rsquo;s your personal universe.
            </h2>
          </div>

          <div ref={mText2Ref} className="flex flex-col gap-4">
            <p className="text-body-28 text-white">
              WORTHFIT combines fitness and nutrition with the magic of story.
            </p>
            <p className="text-body-28 text-white">
              You&rsquo;re not just working out — you&rsquo;re becoming the heroine of your own
              comic adventure. Every chapter brings new workouts, recipes, and motivation — all
              personalized to your journey.
            </p>
          </div>

          <div ref={mText3Ref} className="flex flex-col gap-[18px]">
            <h2 className="text-h1-02 italic uppercase text-[#FF7DA8]">
              No rules. No pressure.
            </h2>
            <p className="text-body-28 text-white">
              Just a story that grows with you — and a body that follows.
            </p>
          </div>

          <div className="relative w-screen left-1/2 -translate-x-1/2">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[75%] overflow-hidden"
              style={{
                backgroundImage: "url(/images/steffy-section-bg.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left bottom",
                backgroundSize: "cover",
              }}
            />

            <div
              ref={mImageWrapRef}
              className="relative mx-auto aspect-[320/400] w-full max-w-[380px]"
            >
              <img
                ref={mGirl01Ref}
                src="/images/steffy-girl-01.svg"
                alt=""
                className="h-full w-full object-contain"
                draggable={false}
              />
              <img
                ref={mGirl02Ref}
                src="/images/steffy-girl-02.svg"
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
              <div
                ref={mBubbleRef}
                className="absolute left-[4%] top-0 w-[150px] origin-bottom-left"
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
    </>
  );
}