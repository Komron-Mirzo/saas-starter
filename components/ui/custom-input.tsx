import React from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextarea?: boolean;
}

export const CustomInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, CustomInputProps>(
  ({ label, isTextarea = false, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-[10px] w-full">
        <label 
          htmlFor={inputId} 
          className="text-caps-14-smbld text-white/60 tracking-wider"
        >
          {label}
        </label>
        {isTextarea ? (
          <textarea
            id={inputId}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className="w-full h-[150px] p-[20px] rounded-[15px] bg-white/[0.05] border border-white/10 text-white text-body-16 focus:outline-none focus:border-white/30 resize-none transition-colors"
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            ref={ref as React.Ref<HTMLInputElement>}
            className="w-full h-[63px] px-[20px] rounded-[15px] bg-white/[0.05] border border-white/10 text-white text-body-16 focus:outline-none focus:border-white/30 transition-colors"
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';