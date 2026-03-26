import { useState } from "react";
import { Pot } from "./Pot";

interface GameScreenProps {
  onWin: () => void;
  onLose: (canRetry: boolean) => void;
  strikes: number;
  setStrikes: React.Dispatch<React.SetStateAction<number>>;
}

export const GameScreen = ({ onWin, onLose, strikes, setStrikes }: GameScreenProps) => {
  const [potsBroken, setPotsBroken] = useState<boolean[]>([false, false, false, false, false]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePotClick = (index: number) => {
    if (potsBroken[index] || isAnimating || strikes <= 0) return;

    setIsAnimating(true);
    
    const newPotsBroken = [...potsBroken];
    newPotsBroken[index] = true;
    setPotsBroken(newPotsBroken);

    // 20% win chance
    const isWin = Math.random() < 0.2;
    const remainingStrikes = strikes - 1;
    setStrikes(remainingStrikes);

    setTimeout(() => {
      if (isWin) {
        onWin();
      } else {
        if (remainingStrikes > 0) {
          onLose(true);
        } else {
          onLose(false);
        }
      }
      setIsAnimating(false);
    }, 800); // Give time for fragment animation to play
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-12 md:pt-24 p-4">
      <div className="glass-card px-8 py-6 mb-16 rounded-3xl flex flex-col items-center shadow-lg border-2 border-white/50">
        <h2 className="text-4xl font-extrabold text-deep-red mb-3 drop-shadow-sm text-center">Pick a Pot!</h2>
        <div className="flex items-center gap-2 bg-white/60 px-5 py-2 rounded-full border border-white/40 shadow-sm">
          <span className="text-xl font-bold text-foreground">Strikes Left:</span>
          <div className="flex gap-1">
            {[...Array(2)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full ${i < strikes ? 'bg-deep-red shadow-[0_0_8px_rgba(217,30,54,0.6)]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-4 w-full max-w-2xl px-4 flex justify-center">
        {/* Support rope/pole rendering behind the pots */}
        <div className="absolute top-0 left-[5%] right-[5%] h-3 bg-gradient-to-r from-[#5c4033] via-[#8b4513] to-[#5c4033] rounded-full z-0 shadow-lg" />
        
        <div className="flex flex-wrap justify-between md:justify-around w-full relative z-10 gap-x-2 gap-y-12">
          {potsBroken.map((isBroken, index) => (
            <Pot 
              key={index} 
              index={index} 
              onClick={handlePotClick} 
              isBroken={isBroken}
              disabled={strikes <= 0 || isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
