import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_POTS = 5;
const MAX_TRIES = 2;

const Index = () => {
  const [winningPot] = useState(() => Math.floor(Math.random() * TOTAL_POTS));
  const [tries, setTries] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [revealedPots, setRevealedPots] = useState<Set<number>>(new Set());

  const handlePick = useCallback(
    (index: number) => {
      if (won !== null || tries >= MAX_TRIES || revealedPots.has(index)) return;
      const newTries = tries + 1;
      setTries(newTries);
      setSelected(index);
      setRevealedPots((prev) => new Set(prev).add(index));

      if (index === winningPot) {
        setWon(true);
      } else if (newTries >= MAX_TRIES) {
        setWon(false);
      }
    },
    [tries, won, winningPot, revealedPots]
  );

  const reset = () => {
    window.location.reload();
  };

  const gameOver = won !== null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6">
      <motion.h1
        className="text-4xl font-bold text-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🏺 Pick a pot to try your luck!
      </motion.h1>

      <p className="text-lg text-muted-foreground">
        Try {tries} of {MAX_TRIES}
      </p>

      <div className="flex gap-4">
        {Array.from({ length: TOTAL_POTS }).map((_, i) => {
          const isRevealed = revealedPots.has(i);
          const isWin = i === winningPot && isRevealed;
          const isLoss = i !== winningPot && isRevealed;

          return (
            <motion.button
              key={i}
              onClick={() => handlePick(i)}
              disabled={gameOver || isRevealed}
              className={`flex h-24 w-20 flex-col items-center justify-center rounded-xl border-2 text-2xl font-bold transition-colors
                ${isWin ? "border-[hsl(var(--win))] bg-[hsl(var(--win)/0.15)] text-[hsl(var(--win))]" : ""}
                ${isLoss ? "border-[hsl(var(--lose))] bg-[hsl(var(--lose)/0.1)] text-[hsl(var(--lose))]" : ""}
                ${!isRevealed ? "cursor-pointer border-[hsl(var(--pot))] bg-[hsl(var(--pot)/0.1)] text-[hsl(var(--pot))] hover:bg-[hsl(var(--pot-hover)/0.2)] hover:scale-105" : ""}
                ${isRevealed ? "cursor-default" : ""}
              `}
              whileTap={!isRevealed && !gameOver ? { scale: 0.9 } : {}}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {isRevealed ? (isWin ? "🎉" : "💨") : "🏺"}
              <span className="mt-1 text-xs">{i + 1}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {won === true && (
          <motion.p
            className="text-2xl font-bold text-[hsl(var(--win))]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🎉 Congratulations! You found the treasure!
          </motion.p>
        )}
        {won === false && (
          <motion.p
            className="text-2xl font-bold text-[hsl(var(--lose))]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            😢 Game Over! Better luck next time!
          </motion.p>
        )}
      </AnimatePresence>

      {gameOver && (
        <motion.button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Play Again
        </motion.button>
      )}
    </div>
  );
};

export default Index;
