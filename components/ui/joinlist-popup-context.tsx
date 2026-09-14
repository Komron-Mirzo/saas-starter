// components/joinlist-popup-context.tsx
'use client';
import { createContext, useContext, useState } from 'react';
import WorthfitJoinlistPopup from '@/components/sections/home/PopupJoinlist';

const JoinlistPopupContext = createContext<() => void>(() => {});

export function JoinlistPopupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <JoinlistPopupContext.Provider value={() => setOpen(true)}>
      {children}
      {open && <WorthfitJoinlistPopup onClose={() => setOpen(false)} />}
    </JoinlistPopupContext.Provider>
  );
}

export const useJoinlistPopup = () => useContext(JoinlistPopupContext);