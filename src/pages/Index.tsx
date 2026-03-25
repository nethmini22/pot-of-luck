import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clayPot from "@/assets/clay-pot.png";
import potWin from "@/assets/pot-broken-win.png";
import potEmpty from "@/assets/pot-broken-empty.png";

const TOTAL_POTS = 5;
const MAX_TRIES = 2;

const confettiEmojis = ["🎊", "🪷", "🌸", "✨", "🎉", "🪔", "🌺"];

const FloatingEmoji = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.span
    className="pointer-events-none fixed text-3xl"
    initial={{ opacity: 1, y: 0, x: Math.random() * 300 - 150 }}
    animate={{ opacity: 0, y: -300, rotate: Math.random() * 360 }}
    transition={{ duration: 2.5, delay, ease: "easeOut" }}
    style={{ left: `${Math.random() * 80 + 10}%`, bottom: "20%" }}
  >
    {emoji}
  </motion.span>
);

const Index = () => {
  const [winningPot] = useState(() => Math.floor(Math.random() * TOTAL_POTS));
  const [tries, setTries] = useState(0);
  const [won, setWon] = useState<boolean | null>(null);
  const [revealedPots, setRevealedPots] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePick = useCallback(
    (index: number) => {
      if (won !== null || tries >= MAX_TRIES || revealedPots.has(index)) return;
      const newTries = tries + 1;
      setTries(newTries);
      setRevealedPots((prev) => new Set(prev).add(index));

      if (index === winningPot) {
        setWon(true);
        setShowConfetti(true);
      } else if (newTries >= MAX_TRIES) {
        setWon(false);
      }
    },
    [tries, won, winningPot, revealedPots]
  );

  const reset = () => window.location.reload();
  const gameOver = won !== null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6">
      {/* Decorative border pattern */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-[hsl(var(--deep-red))] via-[hsl(var(--gold))] to-[hsl(var(--deep-red))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-[hsl(var(--deep-red))] via-[hsl(var(--gold))] to-[hsl(var(--deep-red))]" />

      {/* Floating decorations */}
      <motion.div
        className="pointer-events-none absolute left-6 top-8 text-4xl"
        animate={{ rotate: [0, 10, -10, 0], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        🪔
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-6 top-8 text-4xl"
        animate={{ rotate: [0, -10, 10, 0], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, delay: 1 }}
      >
        🪷
      </motion.div>

      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          🏺 කන මුට්ටි බිඳීම
        </h1>
        <p className="mt-2 text-lg font-medium text-[hsl(var(--festive-orange))]">
          Kana Mutti Bindeema
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a pot to find the treasure!
        </p>
      </motion.div>

      {/* Try counter */}
      <div className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground shadow-sm">
        Try {tries} of {MAX_TRIES}
      </div>

      {/* Pots */}
      <div className="flex flex-wrap justify-center gap-5">
        {Array.from({ length: TOTAL_POTS }).map((_, i) => {
          const isRevealed = revealedPots.has(i);
          const isWin = i === winningPot && isRevealed;
          const isLoss = i !== winningPot && isRevealed;

          return (
            <motion.button
              key={i}
              onClick={() => handlePick(i)}
              disabled={gameOver || isRevealed}
              className={`group relative flex h-36 w-28 flex-col items-center justify-center rounded-2xl border-2 transition-all
                ${isWin ? "border-[hsl(var(--win))] bg-[hsl(var(--win)/0.08)] shadow-lg shadow-[hsl(var(--win)/0.2)]" : ""}
                ${isLoss ? "border-[hsl(var(--lose)/0.4)] bg-[hsl(var(--lose)/0.05)]" : ""}
                ${!isRevealed ? "cursor-pointer border-[hsl(var(--pot)/0.3)] bg-card hover:border-[hsl(var(--pot))] hover:shadow-lg hover:shadow-[hsl(var(--gold)/0.2)]" : "cursor-default"}
              `}
              whileHover={!isRevealed && !gameOver ? { scale: 1.08, y: -4 } : {}}
              whileTap={!isRevealed && !gameOver ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            >
              <motion.img
                src={isRevealed ? (isWin ? potWin : potEmpty) : clayPot}
                alt={`Pot ${i + 1}`}
                className="h-20 w-20 object-contain"
                width={80}
                height={80}
                animate={isWin ? { rotate: [0, -5, 5, 0] } : {}}
                transition={isWin ? { repeat: 2, duration: 0.3 } : {}}
              />
              <span className={`mt-2 text-xs font-bold ${isWin ? "text-[hsl(var(--win))]" : isLoss ? "text-[hsl(var(--lose))]" : "text-muted-foreground"}`}>
                Pot {i + 1}
              </span>
              {!isRevealed && !gameOver && (
                <motion.div
                  className="pointer-events-none absolute -top-1 -right-1 text-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                >
                  ✨
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Result */}
      <AnimatePresence>
        {won === true && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-3xl font-bold text-[hsl(var(--win))]">
              🎉 සුභ අලුත් අවුරුද්දක් වේවා!
            </p>
            <p className="mt-1 text-lg text-[hsl(var(--festive-orange))]">
              Congratulations! You found the treasure!
            </p>
          </motion.div>
        )}
        {won === false && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-2xl font-bold text-[hsl(var(--lose))]">
              😢 Game Over!
            </p>
            <p className="mt-1 text-muted-foreground">
              Better luck next time! The treasure was in Pot {winningPot + 1}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {gameOver && (
        <motion.button
          onClick={reset}
          className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏺 Play Again
        </motion.button>
      )}

      {/* Confetti */}
      {showConfetti &&
        confettiEmojis.map((emoji, i) => (
          <FloatingEmoji key={i} emoji={emoji} delay={i * 0.15} />
        ))}
    </div>
  );
};

export default Index;
