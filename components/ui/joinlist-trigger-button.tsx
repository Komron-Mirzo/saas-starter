// components/ui/waitlist-trigger-button.tsx
"use client";

import { Button, type ButtonProps } from '@/components/ui/button';
import { useJoinlistPopup } from '@/components/ui/joinlist-popup-context';

export function WaitlistTriggerButton({ children, ...props }: ButtonProps) {
  const openPopup = useJoinlistPopup();
  return (
    <Button {...props} onClick={openPopup}>
      {children}
    </Button>
  );
}