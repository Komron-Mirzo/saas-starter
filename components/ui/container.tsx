export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1870px] mx-auto w-full bg-[#f3f3f3] ${className}`}>
      {children}
    </div>
  );
}