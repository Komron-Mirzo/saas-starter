import { Button } from '@/components/ui/button';

export function StaticPink() {
  return (
    <section className="bg-primary w-full h-[100vh] max-h-[900px] px-6 flex flex-col items-center justify-center text-center overflow-hidden z-1">
      <div className="max-w-[1298px] w-full mx-auto flex flex-col items-center justify-center">
        
        {/* First Text: Caps 18 */}
        <p className="text-caps-18-smbld text-white max-w-4xl">
          HELPING WOMEN RECONNECT WITH THEIR BODIES. RECLAIM THEIR POWER AND FEEL JOY IN THE PROCESS — NOT PRESSURE. WORTHFIT IS WHERE TRANSFORMATION MEETS PLAY, PRESENCE, AND SELF-EXPRESSION.
        </p>

        {/* 50px Gap */}
        <div className="h-[50px] shrink-0" />

        {/* Second Text: Poppins 30px Extrabold Italic, Uppercase, 85% Line Height, -2% Letter Spacing */}
        <h2 
          className="text-white font-[800] italic uppercase max-w-4xl"
          style={{
            fontFamily: 'var(--font-poppins), sans-serif',
            fontSize: '30px',
            lineHeight: '85%',
            letterSpacing: '-0.02em',
          }}
        >
          And you're never alone on this journey. I'm with you every step of the way — through our vibrant community and daily chats.
        </h2>

        {/* 50px Gap */}
        <div className="h-[50px] shrink-0" />

        {/* Third Text: Caps 18 */}
        <p className="text-caps-18-smbld text-white max-w-4xl">
          Together, we grow, laugh, stumble, and rise. That's the Worthfit way.
        </p>

        {/* 60px Gap before the button */}
        <div className="h-[60px] shrink-0" />

        {/* Button: Variant White */}
        <Button variant="white" >
          Start Your Journey
        </Button>

      </div>
    </section>
  );
}