'use client';

import { useState, useTransition } from 'react';
import { CustomInput } from '@/components/ui/custom-input';
import { CustomPhoneInput } from '@/components/ui/phone-input';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';

interface CustomContactSectionProps {
  action: (formData: FormData) => Promise<{ success: boolean; error: string | null }>;
}

export default function CustomContactSection({ action }: CustomContactSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  
  // State for phone input
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Validate phone number (basic validation)
  const validatePhone = (phone: string): string | null => {
    if (!phone) return 'Phone number is required';
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    // Check if phone has at least 8 digits
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 8) return 'Please enter a valid phone number';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPhoneError('');

    // Validate phone
    const phoneValidationError = validatePhone(phoneValue);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    
    // Append the phone value with country code
    formData.set('phone', phoneValue);

    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        setShowSuccessModal(true);
        formElement.reset();
        setIsChecked(false);
        setPhoneValue(''); // Reset phone input
        setPhoneError('');
      } else {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <>
      <section className="w-full py-[140px] lg:py-[260px] px-[20px] lg:px-[45px] bg-[#1b1b1b] flex justify-center items-center relative">
        <div className="w-full max-w-[1560px] flex flex-col lg:flex-row justify-between items-start gap-16">
          
          {/* Left Side: Max Width 641px */}
          <div className="w-[100%] lg:50% lg:max-w-[641px] flex flex-col">
            <h2 className="text-h1-02 text-white italic">
              NEED MORE CLARITY BEFORE YOU GLOW?
            </h2>
            <p className="text-body-18 text-white/80 mt-[25px]">
              Ask us anything — we're here for it.
            </p>
          </div>

          {/* Right Side: Max Width 50% */}
          <div className="w-[100%] lg:50%">
            <form onSubmit={handleSubmit} className="flex flex-col">
              
              {/* Grid for Inputs: Column gap 15px, Row gap 25px */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[15px] gap-y-[25px]">
                <CustomInput label="NAME" name="name" required placeholder="" />
                <CustomInput label="SURNAME" name="surname" required placeholder="" />
                
                {/* Phone Input with Country Codes - uses full width in grid */}
                <div className="col-span-1">
                  <CustomPhoneInput
                    value={phoneValue}
                    onChange={(value) => {
                      setPhoneValue(value);
                      // Clear error when user types
                      if (phoneError) setPhoneError('');
                    }}
                    error={phoneError}
                    label="PHONE NUMBER"
                  />
                </div>
                
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
                    className="sr-only"
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <div className={`w-[35px] h-[35px] rounded-full border-[2px] ${isChecked ? 'border-white' : 'border-white/15'} bg-transparent flex items-center justify-center transition-all duration-200`}>
                    <div className={`w-[17px] h-[17px] rounded-full bg-white transition-all duration-200 ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                  </div>
                </label>
                <span className="text-caps-14-smbld text-white/70">
                  BY CONTINUING, YOU AGREE TO <a href="/terms" className="underline hover:text-white">THE TERMS OF USE</a> AND <a href="/privacy" className="underline hover:text-white">PRIVACY POLICY</a>.
                </span>
              </div>

              {/* Error Feedback Message */}
              {errorMessage && (
                <p className="text-sm font-medium text-red-500 mt-4">{errorMessage}</p>
              )}
            
            {/* Submit Button with 50px space from checkbox */}
            <div className="mt-[50px] flex justify-start">
              <Button
                type="submit"
                disabled={isPending}
                variant="default"
                className="lg:w-[calc(50%-10px)] w-full "
              >
                {isPending ? 'SENDING...' : 'SEND'}
              </Button>
            </div>

            </form>
          </div>

        </div>
      </section>

      {/* Brand-Adapted Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-[500px] bg-white rounded-[24px] p-8 md:p-10 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Right Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-start">
              
              {/* Optional Accent Icon/Badge */}
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F4] text-primary flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold italic text-gray-900 tracking-tight">
                THANK YOU!
              </h3>
              
              <p className="text-gray-600 text-base mt-3 leading-relaxed">
                Your message has been sent successfully. We have also sent a confirmation copy to your inbox. Our team will get back to you shortly!
              </p>

              {/* Action Button */}
              <div className="mt-8 w-full">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-[14px] transition-opacity hover:opacity-90 flex items-center justify-center cursor-pointer"
                >
                  GOT IT
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}