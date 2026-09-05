import React, { useMemo } from 'react';

interface FestivalParticlesProps {
  festivalId: string;
}

export const FestivalParticles: React.FC<FestivalParticlesProps> = ({ festivalId }) => {
  const particles = useMemo(() => {
    let emojis = ['✨', '⭐'];
    if (festivalId === 'christmas') emojis = ['❄️', '❅', '❆', '✨'];
    else if (festivalId === 'halloween') emojis = ['🎃', '👻', '🦇', '✨'];
    else if (festivalId === 'lunar_new_year') emojis = ['🧧', '🏮', '✨', '🪙'];
    else if (festivalId === 'cherry_blossom') emojis = ['🌸', '💮', '✨'];
    else if (festivalId === 'summer_solstice') emojis = ['☀️', '🌴', '🌊', '✨'];

    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(i * 7.1 + Math.random() * 3).toFixed(1)}%`,
      animationDuration: `${(6 + (i % 5) * 1.5).toFixed(1)}s`,
      animationDelay: `${((i * 0.7) % 5).toFixed(1)}s`,
      fontSize: `${14 + (i % 3) * 6}px`,
      opacity: 0.25 + (i % 4) * 0.15
    }));
  }, [festivalId]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute -top-10 animate-fall"
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            fontSize: p.fontSize,
            opacity: p.opacity
          }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(15px);
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-15px);
          }
        }
        .animate-fall {
          animation-name: fall;
        }
      `}</style>
    </div>
  );
};
