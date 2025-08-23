import { useEffect } from "react";

interface IntroSplashProps {
  onFinish: () => void;
  durationMs?: number;
}

const IntroSplash = ({ onFinish, durationMs = 2800 }: IntroSplashProps) => {
  useEffect(() => {
    const t = setTimeout(() => onFinish(), durationMs);
    return () => clearTimeout(t);
  }, [onFinish, durationMs]);

  return (
    <div className="fixed inset-0 z-50 bg-hero flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center text-center select-none animate-enter">
        {/* Spinning rings */}
        <div className="relative mb-8">
          <div className="h-40 w-40 rounded-full border-2 border-primary/60 animate-spin [animation-duration:3s]" />
          <div className="absolute inset-4 h-32 w-32 rounded-full border border-border animate-[spin_4s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-xl surface-card flex items-center justify-center shadow-lg">
              <span aria-hidden className="text-3xl font-extrabold tracking-tight headline-gradient animate-bounce">♞</span>
            </div>
          </div>
        </div>
        {/* Brand */}
        <h1 className="text-4xl font-extrabold headline-gradient">ChessChain</h1>
        <p className="mt-2 text-sm text-muted-foreground">Stake ETH. Play Chess. Winner takes all.</p>
      </div>
      {/* Fade curtain */}
      <div className="pointer-events-none absolute inset-0 animate-fade-out" style={{ animationDelay: `${Math.max(0, (durationMs - 800))}ms` }} />
    </div>
  );
};

export default IntroSplash;
