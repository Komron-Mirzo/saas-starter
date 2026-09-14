'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // adjust path if your Button lives elsewhere

type Interest = 'fitness' | 'nutrition' | 'both';

const INTEREST_OPTIONS: { value: Interest; label: string; icon: string }[] = [
  { value: 'fitness', label: 'Fitness', icon: '/icons/worthfit-popup-icon-01.svg' },
  { value: 'nutrition', label: 'Nutrition', icon: '/icons/worthfit-popup-icon-02.svg' },
  { value: 'both', label: 'Both', icon: '/icons/worthfit-popup-icon-03.svg' },
];

interface WorthfitJoinlistPopupProps {
  onClose: () => void;
}

export default function WorthfitJoinlistPopup({ onClose }: WorthfitJoinlistPopupProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState<Interest>('fitness');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !email.trim() || !agreed) {
      setError('Please fill in your details and accept the privacy policy.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/joinlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, interest }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1AB2] p-[20px] max-[768px]:items-end max-[768px]:p-0">
  <div className="flex w-[1020px] max-h-[840px] h-full max-w-full overflow-y-auto scrollbar-none gap-[40px] rounded-[75px] bg-[#F3F3F3] p-[15px] max-[1200px]:m-[20px] max-[768px]:m-0 max-[768px]:max-h-[900px] max-[768px]:rounded-b-none max-[768px]:rounded-t-[50px] max-[768px]:p-[20px]" style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none',  /* IE and Edge */
        }}>
        {!submitted ? (
          // ==========================================
          // I) FORM DIV
          // ==========================================
          <>
            <div className="relative h-[810px] min-h-[810px] w-1/2 overflow-hidden rounded-[60px] border-[5px] border-white max-[1024px]:w-[40%] max-[768px]:hidden">
              <img
                src="/images/worthfit-popup.jpg"
                alt="Worthfit"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="flex w-1/2 h-full flex-col justify-start py-[20px] pr-[20px] max-[1024px]:w-[60%] max-[768px]:w-full max-[768px]:justify-start max-[768px]:pr-0">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="mb-[5px] ml-auto"
              >
                <img
                  src="/icons/worthfit-popup-close.svg"
                  alt="Close"
                  width={35}
                  height={35}
                />
              </button>

              <span className="text-caps-14-smbld mb-[20px] rounded-full w-fit bg-white px-[10px] py-[5px] uppercase text-[#1a1a1a]">
                Your Story Starts Soon
              </span>

              <h3 className="text-h3-02 mb-[20px] italic !uppercase text-[#FF7DA8] max-[768px]:!text-[32px]">
                Be First to Enter the Worlds of Worthfit
              </h3>

              <p className="text-body-14 mb-[20px] text-[#1a1a1a]/60">
                Join the Worthfit waitlist and be one of the first to know when the doors open.
                Get early access to your workouts, recipes and your own interactive Story World.
              </p>

              <form onSubmit={handleSubmit}>
                <label className="text-caps-14-smbld mb-[10px] block uppercase text-[#1a1a1a]/60">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your First Name"
                  className="mb-[20px] h-[58px] w-full rounded-[10px] border-[1.5px] border-[#1a1a1a]/15 bg-white px-[20px] placeholder-[#1a1a1a]/25"
                />

                <label className="text-caps-14-smbld mb-[10px] block uppercase text-[#1a1a1a]/60">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="mb-[20px] h-[58px] w-full rounded-[10px] border-[1.5px] border-[#1a1a1a]/15 bg-white px-[20px] placeholder-[#1a1a1a]/25"
                />

                <label className="text-caps-14-smbld mb-[10px] block uppercase text-[#1a1a1a]/60">
                  What Are You Here For?
                </label>
                <div className="mb-[36px] flex gap-[10px]">
                  {INTEREST_OPTIONS.map((option) => {
                    const active = interest === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex flex-1 cursor-pointer items-center rounded-[10px] border-[1.5px] px-[10px] py-[20px] max-[1024px]:flex-col max-[1024px]:items-start max-[1024px]:gap-[15px] ${
                          active
                            ? 'border-[#FF7DA8] bg-[#FF7DA8]/10'
                            : 'border-[#1a1a1a]/15 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="interest"
                          value={option.value}
                          checked={active}
                          onChange={() => setInterest(option.value)}
                          className="hidden"
                        />
                        <img
                          src={option.icon}
                          alt=""
                          width={35}
                          height={35}
                          className="mr-[10px]"
                        />
                        <span className="text-caps-14-smbld uppercase text-[#1a1a1a]/60">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {error && <p className="text-body-14 mb-[10px] text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="text-btn bg-primary mb-[10px] w-full rounded-full py-[18px] text-white shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#1A1A1A] disabled:opacity-60 h-[65px]"
                >
                  {submitting ? 'Joining...' : 'Join the Waitlist'}
                </button>

                <p className="text-body-14 mb-[20px] text-center text-[#1a1a1a]">
                  No spam. Just Worthfit updates, early access &amp; a little glow.
                </p>

                <label className="text-body-14 flex cursor-pointer items-start text-[#1a1a1a]/40 mb-[20px]">
                  <span className="relative mr-[15px] mt-[2px] inline-flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-[#1a1a1a]/15 bg-transparent has-[:checked]:border-[#FF7DA8] has-[:checked]:bg-[#FF7DA8]">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    {agreed && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="8" fill="none" viewBox="0 0 13 8">
                        <path fill="#fff" d="M13 1.19 11.684 0 6.5 5.431 1.317 0 0 1.19 6.5 8z" />
                      </svg>
                    )}
                  </span>
                  I agree that Worthfit may use my email address to send me updates about the
                  launch and early access. With Privacy Policy linked.
                </label>
              </form>
            </div>
          </>
        ) : (
          // ==========================================
          // II) SUCCESS DIV
          // ==========================================
          <div className="flex w-full h-full flex-col gap-[40px]">
            <div className="flex h-[45%] flex-1 flex-col items-center justify-start text-center p-[20px] max-[768px]:p-0 max-[768px]:h-[40%]">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="mb-[5px] ml-auto"
              >
                <img
                  src="/icons/worthfit-popup-close.svg"
                  alt="Close"
                  width={35}
                  height={35}
                />
              </button>

              <span className="text-caps-14-smbld mb-[20px] w-fit bg-[#30D5C8] rounded-full text-white px-[10px] py-[5px] uppercase">
                You&rsquo;re In!
              </span>

              <h3 className="text-h2-02 mb-[20px] italic !uppercase text-[#FF7DA8] max-w-[875px] max-[768px]:!text-[32px]">
                Welcome to the Beginning of Your Glow Story
              </h3>

              <p className="text-body-14 mb-[20px] text-[#1a1a1a]/60 max-w-[490px]">
                You&rsquo;re officially on the Worthfit waitlist. We&rsquo;ll let you know as soon
                as the doors to your Story World open.
              </p>

              <Button variant="white" onClick={onClose}>
                Start Your Journey
              </Button>
            </div>

            <div className="relative h-[55%] max-h-[40vh] w-full overflow-hidden rounded-[60px] border-[5px] border-white max-[768px]:!h-[55%] max-[768px]:rounded-[40px] max-[768px]:max-h-[60vh]">
              <img
                src="/images/worthfit-popup-success.jpg"
                alt="Welcome to Worthfit"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}