// components/ui/PhoneInput.tsx
'use client';

import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
}

export const CustomPhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label = 'PHONE NUMBER',
}) => {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <label className="text-caps-14-smbld text-white/60 tracking-wider">
        {label}
      </label>
      <div className="relative">
        <PhoneInput
          country={'de'}
          value={value}
          onChange={(phone) => onChange(phone)}
          onBlur={onBlur}
          inputClass={`!w-full !h-[63px] !px-[20px] !rounded-[15px] !bg-white/[0.05] !border ${
            error ? '!border-red-500' : '!border-white/10'
          } !text-white !text-body-16 !focus:border-white/30 !transition-all !duration-300 !pl-[60px]`}
          buttonClass="!bg-transparent !border-r !border-white/10 !rounded-l-[15px] !hover:!bg-white/5 !transition-all !duration-300"
          buttonStyle={{
            backgroundColor: 'transparent',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '15px 0 0 15px',
          }}
          dropdownClass="!bg-[#1b1b1b]/90 !backdrop-blur-xl !text-white !border-white/10 !rounded-[15px] !overflow-hidden !shadow-2xl"
          searchClass="!bg-white/5 !backdrop-blur-sm !text-white !border-white/10 !rounded-[15px] !focus:border-white/30 !transition-all !duration-300 !mb-2"
          searchStyle={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(4px)',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
          }}
          enableSearch={true}
          searchPlaceholder="Search country..."
          countryCodeEditable={true}
          enableAreaCodes={false}
          autoFormat={true}
          enableLongNumbers={true}
          disableCountryCode={false}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      
      {/* Override default styles */}
      <style>{`
        /* Override default white hover background and add border-radius */
        .react-tel-input .selected-flag,
        .react-tel-input .selected-flag:hover,
        .react-tel-input .selected-flag:focus,
        .react-tel-input .selected-flag:active,
        .react-tel-input .selected-flag:focus-visible {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-radius: 15px 0 0 15px !important;
          outline: none !important;
        }

        .react-tel-input .country-list .country:hover, .react-tel-input .country-list .country.highlight {
        background-color: rgba(255, 255, 255, 0.05) !important;
        }
        
        /* Ensure selected flag always has 15px border-radius on left side */
        .react-tel-input .selected-flag {
          border-radius: 15px 0 0 15px !important;
        }
        
        /* Override the flag dropdown button default border-radius */
        .react-tel-input .flag-dropdown {
          border-radius: 15px 0 0 15px !important;
        }
      `}</style>
    </div>
  );
};