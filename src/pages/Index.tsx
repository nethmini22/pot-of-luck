import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clayPot from "@/assets/clay-pot.png";
import potWin from "@/assets/pot-broken-win.png";
import potEmpty from "@/assets/pot-broken-empty.png";

const TOTAL_POTS = 5;
const MAX_PICKS_PER_TRY = 2;
const MAX_TRIES = 2;

const confettiEmojis = ["🎊", "🪷", "🌸", "✨", "🎉", "🪔", "🌺", "🎆", "🪅"];

const FloatingEmoji = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.span
    className="pointer-events-none fixed text-4xl"
    initial={{ opacity: 1, y: 0, x: Math.random() * 300 - 150 }}
    animate={{ opacity: 0, y: -400, rotate: Math.random() * 360 }}
    transition={{ duration: 3, delay, ease: "easeOut" }}
    style={{ left: `${Math.random() * 80 + 10}%`, bottom: "20%" }}
  >
    {emoji}
  </motion.span>
);

const Index = () => {
  const [currentTry, setCurrentTry] = useState(1);
  const [picksThisTry, setPicksThisTry] = useState(0);
  const [won, setWon] = useState<boolean | null>(null);
  const [revealedPots, setRevealedPots] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [winningPot, setWinningPot] = useState(() =>
    Math.floor(Math.random() * TOTAL_POTS)
  );

  const gameOver = won !== null;

  const startNextTry = useCallback(() => {
    // Reset pots for a new try with a new winning pot
    setRevealedPots(new Set());
    setPicksThisTry(0);
    setCurrentTry((prev) => prev + 1);
    setWinningPot(Math.floor(Math.random() * TOTAL_POTS));
  }, []);

  const handlePick = useCallback(
    (index: number) => {
      if (gameOver || revealedPots.has(index)) return;

      const newPicks = picksThisTry + 1;
      setPicksThisTry(newPicks);
      setRevealedPots((prev) => new Set(prev).add(index));

      if (index === winningPot) {
        setWon(true);
        setShowConfetti(true);
      } else if (newPicks >= MAX_PICKS_PER_TRY) {
        // Used all picks this try
        if (currentTry >= MAX_TRIES) {
          setWon(false);
        } else {
          // Auto-advance to next try after a short delay
          setTimeout(() => startNextTry(), 1200);
        }
      }
    },
    [picksThisTry, gameOver, winningPot, revealedPots, currentTry, startNextTry]
  );

  const reset = () => window.location.reload();

  const waitingForNextTry =
    !gameOver && picksThisTry >= MAX_PICKS_PER_TRY && currentTry < MAX_TRIES;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6">
      {/* Avurudu festive background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, hsl(var(--gold)) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, hsl(var(--deep-red)) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, hsl(var(--festive-orange)) 0%, transparent 60%)
          `,
        }}
      />
      {/* Repeating mandala-inspired pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-conic-gradient(from 0deg at 50% 50%, hsl(var(--gold)) 0deg 30deg, transparent 30deg 60deg)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* Decorative border pattern */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-[hsl(var(--deep-red))] via-[hsl(var(--gold))] to-[hsl(var(--deep-red))]" />
      <div className="pointer-events-none absolute inset-x-0 top-4 h-1 bg-gradient-to-r from-[hsl(var(--festive-orange))] via-[hsl(var(--deep-red))] to-[hsl(var(--festive-orange))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-[hsl(var(--deep-red))] via-[hsl(var(--gold))] to-[hsl(var(--deep-red))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-4 h-1 bg-gradient-to-r from-[hsl(var(--festive-orange))] via-[hsl(var(--deep-red))] to-[hsl(var(--festive-orange))]" />

      {/* Corner decorations */}
      {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos, i) => (
        <motion.div
          key={pos}
          className={`pointer-events-none absolute ${pos} text-3xl`}
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
        >
          🪔
        </motion.div>
      ))}

      {/* Floating festive elements */}
      {["🪷", "🌺", "🌸"].map((emoji, i) => (
        <motion.div
          key={emoji}
          className="pointer-events-none absolute text-2xl opacity-40"
          style={{ left: `${20 + i * 25}%`, top: `${15 + i * 12}%` }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 5 + i, delay: i * 0.8 }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          🏺 කන මුට්ටි බිඳීම
        </h1>
        <p className="mt-2 text-lg font-medium text-festive-orange">
          Kana Mutti Bindeema
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a pot to find the treasure! ({MAX_PICKS_PER_TRY} picks per try)
        </p>
      </motion.div>

      {/* Try & Pick counters */}
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground shadow-sm">
          Try {currentTry} of {MAX_TRIES}
        </div>
        <div className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
          Pick {picksThisTry} of {MAX_PICKS_PER_TRY}
        </div>
      </div>

      {/* Pots */}
      <div className="flex flex-wrap justify-center gap-5">
        {Array.from({ length: TOTAL_POTS }).map((_, i) => {
          const isRevealed = revealedPots.has(i);
          const isWin = i === winningPot && isRevealed;
          const isLoss = i !== winningPot && isRevealed;
          const isClickable = !isRevealed && !gameOver && !waitingForNextTry;

          return (
            <motion.button
              key={`${currentTry}-${i}`}
              onClick={() => handlePick(i)}
              disabled={!isClickable}
              className={`group relative flex h-36 w-28 flex-col items-center justify-center rounded-2xl border-2 transition-all
                ${isWin ? "border-[hsl(var(--win))] bg-[hsl(var(--win)/0.08)] shadow-lg shadow-[hsl(var(--win)/0.2)]" : ""}
                ${isLoss ? "border-muted bg-muted/30 opacity-60 grayscale" : ""}
                ${isClickable ? "cursor-pointer border-[hsl(var(--pot)/0.3)] bg-card hover:border-[hsl(var(--pot))] hover:shadow-lg hover:shadow-[hsl(var(--gold)/0.3)]" : ""}
                ${!isClickable && !isRevealed ? "cursor-default border-border bg-card opacity-50" : ""}
              `}
              whileHover={isClickable ? { scale: 1.08, y: -6 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isLoss ? 0.6 : 1, y: 0 }}
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
              <span
                className={`mt-2 text-xs font-bold ${
                  isWin
                    ? "text-[hsl(var(--win))]"
                    : isLoss
                    ? "text-muted-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Pot {i + 1}
              </span>
              {isClickable && (
                <motion.div
                  className="pointer-events-none absolute -top-1 -right-1 text-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                >
                  ✨
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Waiting for next try message */}
      <AnimatePresence>
        {waitingForNextTry && (
          <motion.p
            className="text-lg font-semibold text-festive-orange"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No luck! Moving to next try…
          </motion.p>
        )}
      </AnimatePresence>

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
            <p className="mt-1 text-lg text-festive-orange">
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
              Better luck next time!
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
          <FloatingEmoji key={i} emoji={emoji} delay={i * 0.12} />
        ))}
    </div>
  );
};

export default Index;
