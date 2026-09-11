'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const LOADER_ID = 'scroll-jump-loader';

function createLoader(): HTMLElement {
  let overlay = document.getElementById(LOADER_ID);
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = LOADER_ID;
  overlay.innerHTML = `
    <style>
      #scroll-jump-loader {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: #F3F3F3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0;
        opacity: 0;
        pointer-events: none;
        /* ZERO transition on appear so it snaps to opaque instantly */
      }
      #scroll-jump-loader.visible {
        opacity: 1;
        pointer-events: all;
      }
      #scroll-jump-loader.hiding {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease; /* Smooth fade-out only */
      }

      #sjl-logo {
        width: 157px;
        height: 65px;
        animation: sjl-bounce 0.7s ease-in-out infinite alternate;
      }
      @keyframes sjl-bounce {
        from { transform: translateY(0px);   }
        to   { transform: translateY(-10px); }
      }

      #sjl-track {
        margin-top: 40px;
        width: 220px;
        height: 10px;
        background: #D9D9D9;
        border-radius: 99px;
        overflow: hidden;
        outline: 2.5px solid #1A1A1A;
        outline-offset: 2px;
      }

      #sjl-bar {
        height: 100%;
        width: 0%;
        background: #FF7DA8;
        border-radius: 99px;
        transition: width 0.08s linear;
        position: relative;
      }

      #sjl-bar::after {
        content: '';
        position: absolute;
        top: 1px;
        left: 6px;
        right: 6px;
        height: 3px;
        background: rgba(255,255,255,0.55);
        border-radius: 99px;
      }

      #sjl-dots {
        margin-top: 14px;
        display: flex;
        gap: 6px;
      }
      #sjl-dots span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #D9D9D9;
        border: 2px solid #1A1A1A;
        transition: background 0.15s;
      }
      #sjl-dots span.active {
        background: #30D5C8;
      }
    </style>

    <img id="sjl-logo" src="/icons/logo-white.svg" alt="Loading" />

    <div id="sjl-track">
      <div id="sjl-bar"></div>
    </div>

    <div id="sjl-dots">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

let progressRaf: number | null = null;

function showLoader(durationMs: number, onDone: () => void) {
  const overlay = createLoader();
  const bar = overlay.querySelector('#sjl-bar') as HTMLElement;
  const dots = overlay.querySelectorAll('#sjl-dots span');

  // Reset states
  bar.style.width = '0%';
  dots.forEach(d => d.classList.remove('active'));

  // INSTANT SHOW: Remove hiding class and apply visible immediately with no delay
  overlay.classList.remove('hiding');
  overlay.classList.add('visible');

  const start = performance.now();
  const totalDots = dots.length;

  function tick() {
    const elapsed = performance.now() - start;
    const raw = Math.min(elapsed / durationMs, 1);

    const eased = 1 - Math.pow(1 - raw, 2);
    bar.style.width = `${eased * 100}%`;

    const activeDot = Math.floor(eased * totalDots);
    dots.forEach((d, i) => {
      d.classList.toggle('active', i < activeDot);
    });

    if (raw < 1) {
      progressRaf = requestAnimationFrame(tick);
    } else {
      bar.style.width = '100%';
      dots.forEach(d => d.classList.add('active'));

      setTimeout(() => {
        // Smooth fade-out only when finished
        overlay.classList.remove('visible');
        overlay.classList.add('hiding');
        setTimeout(onDone, 200); 
      }, 120);
    }
  }

  if (progressRaf) cancelAnimationFrame(progressRaf);
  progressRaf = requestAnimationFrame(tick);
}

export function ScrollTriggerHashFix() {
  useEffect(() => {
    // Pre-mount the loader into the DOM immediately on load so it's ready instantly on click
    createLoader();

    const processJump = (targetSelector: string, updateHistory = true) => {
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;

      const triggersWithScrub = ScrollTrigger.getAll().filter(trigger => {
        const scrub = (trigger as any).vars?.scrub;
        return typeof scrub === 'number' && scrub > 0;
      });

      const maxScrub = triggersWithScrub.reduce((max, trigger) => {
        const scrub = (trigger as any).vars?.scrub;
        return Math.max(max, typeof scrub === 'number' ? scrub : 0);
      }, 0);

      const waitMs = Math.max(maxScrub * 1000, 500);

      const maskedEls: Array<{ el: HTMLElement; originalOpacity: string }> = [];

      triggersWithScrub.forEach(trigger => {
        const pinEl = (trigger as any).pin as HTMLElement | undefined;
        const triggerEl = trigger.trigger as HTMLElement | undefined;
        const pinSpacer = pinEl?.parentElement?.classList.contains('pin-spacer')
          ? pinEl.parentElement
          : pinEl ?? triggerEl;

        if (pinSpacer) {
          maskedEls.push({ el: pinSpacer, originalOpacity: pinSpacer.style.opacity });
          pinSpacer.style.opacity = '0';
        }
      });

      // TRIGGER LOADER IMMEDIATELY BEFORE ANY GEOMETRY CHANGES
      showLoader(waitMs, () => {
        maskedEls.forEach(({ el, originalOpacity }) => {
          gsap.fromTo(el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.35,
              ease: 'power1.inOut',
              overwrite: true,
              onComplete: () => { el.style.opacity = originalOpacity; },
            }
          );
        });
      });

      window.scrollTo(0, targetElement.getBoundingClientRect().top + window.pageYOffset);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
        if (updateHistory) {
          window.history.pushState(null, '', targetSelector);
        }
      });
    };

    if (window.location.hash) {
      const hash = window.location.hash;
      window.scrollTo(0, 0);
      setTimeout(() => processJump(hash, false), 150);
    }

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href?.includes('#')) {
        const hash = href.substring(href.indexOf('#'));
        if (document.querySelector(hash)) {
          e.preventDefault();
          processJump(hash, true);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return null;
}