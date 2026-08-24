export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1870px] mx-auto px-8 w-full ${className}`}>
      {children}
    </div>
  );
}