'use client';

import { useState, useTransition } from 'react';
import { CustomInput } from '@/components/ui/custom-input';

interface CustomContactSectionProps {
  action: (formData: FormData) => Promise<{ success: boolean; error: string | null }>;
}

export default function CustomContactSection({ action }: CustomContactSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        setSuccessMessage('Thank you! Your message has been sent successfully.');
        (event.target as HTMLFormElement).reset();
      } else {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-[#1b1b1b] flex justify-center items-center">
      <div className="w-full max-w-[1560px] flex flex-col lg:flex-row justify-between items-start gap-16">
        
        {/* Left Side: Max Width 641px */}
        <div className="w-full lg:max-w-[641px] flex flex-col">
          <h2 className="text-h1-02 text-white italic">
            NEED MORE CLARITY BEFORE YOU GLOW?
          </h2>
          <p className="text-body-18 text-white/80 mt-[25px]">
            Ask us anything — we're here for it.
          </p>
        </div>

        {/* Right Side: Max Width 50% */}
        <div className="w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            {/* Grid for Inputs: Column gap 15px, Row gap 25px */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[15px] gap-y-[25px]">
              <CustomInput label="NAME" name="name" required placeholder="" />
              <CustomInput label="SURNAME" name="surname" required placeholder="" />
              <CustomInput label="PHONE NUMBER" name="phone" type="tel" required placeholder="" />
              <CustomInput label="E-MAIL" name="email" type="email" required placeholder="" />
            </div>

            {/* Message Full Width Row */}
            <div className="mt-[25px]">
              <CustomInput label="YOUR MESSAGE" name="message" isTextarea required placeholder="" />
            </div>

            {/* Checkbox Group */}
            <div className="flex items-center gap-[8.5px] mt-[25px]">
              <label className="relative flex items-center justify-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="terms" 
                  required 
                  className="peer sr-only"
                />
                <div className="w-[35px] h-[35px] rounded-lg border border-white/15 bg-transparent flex items-center justify-center transition-all peer-checked:border-white">
                  <div className="w-[15px] h-[15px] rounded-full bg-white scale-0 transition-transform peer-checked:scale-100" />
                </div>
              </label>
              <span className="text-caps-14-smbld text-white/70">
                BY CONTINUING, YOU AGREE TO <a href="/terms" className="underline hover:text-white">THE TERMS OF USE</a> AND <a href="/privacy" className="underline hover:text-white">PRIVACY POLICY</a>.
              </span>
            </div>

            {/* Feedback Messages */}
            {successMessage && (
              <p className="text-sm font-medium text-secondary mt-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-sm font-medium text-destructive mt-4">{errorMessage}</p>
            )}

            {/* Submit Button with 50px space from checkbox */}
            <div className="mt-[50px]">
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-[63px] bg-primary text-primary-foreground text-btn rounded-[15px] transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {isPending ? 'SENDING...' : 'SEND'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}