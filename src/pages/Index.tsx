import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clayPot from "@/assets/clay-pot.png";
import potWin from "@/assets/pot-broken-win.png";
import potEmpty from "@/assets/pot-broken-empty.png";

const TOTAL_POTS = 5;
const MAX_PICKS_PER_TRY = 2;
const MAX_TRIES = 2;
const DISCOUNT_CODE = "WIN10";

const confettiEmojis = ["🎊", "🪷", "🌸", "✨", "🎉", "🪔", "🌺", "🎆", "🪅", "🥥", "🍌"];

const FloatingEmoji = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.span
    className="pointer-events-none fixed text-4xl"
    initial={{ opacity: 1, y: 0, x: Math.random() * 300 - 150 }}
    animate={{ opacity: 0, y: -500, rotate: Math.random() * 520 }}
    transition={{ duration: 3.5, delay, ease: "easeOut" }}
    style={{ left: `${Math.random() * 80 + 10}%`, bottom: "15%" }}
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
  const [copied, setCopied] = useState(false);
  const [winningPot, setWinningPot] = useState(() =>
    Math.floor(Math.random() * TOTAL_POTS)
  );

  const gameOver = won !== null;

  const startNextTry = useCallback(() => {
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
        if (currentTry >= MAX_TRIES) {
          setWon(false);
        } else {
          setTimeout(() => startNextTry(), 1500);
        }
      }
    },
    [picksThisTry, gameOver, winningPot, revealedPots, currentTry, startNextTry]
  );

  const reset = () => window.location.reload();

  const copyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waitingForNextTry =
    !gameOver && picksThisTry >= MAX_PICKS_PER_TRY && currentTry < MAX_TRIES;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-background p-6">
      {/* Avurudu radial glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, hsl(var(--gold) / 0.12) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 85% 80%, hsl(var(--deep-red) / 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 90% 50% at 50% 100%, hsl(var(--festive-orange) / 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Kolam / mandala repeating pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            repeating-conic-gradient(from 0deg at 50% 50%, hsl(var(--gold)) 0deg 20deg, transparent 20deg 40deg)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Decorative double-stripe borders */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-r from-[hsl(var(--deep-red))] via-[hsl(var(--gold))] to-[hsl(var(--deep-red))]" />
      <div className="pointer-events-none absolute inset-x-0 top-5 h-[3px] bg-gradient-to-r from-[hsl(var(--festive-orange))] via-[hsl(var(--deep-red))] to-[hsl(var(--festive-orange))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-r from-[hsl(var(--deep-red))] via-[hsl(var(--gold))] to-[hsl(var(--deep-red))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-5 h-[3px] bg-gradient-to-r from-[hsl(var(--festive-orange))] via-[hsl(var(--deep-red))] to-[hsl(var(--festive-orange))]" />

      {/* Corner oil lamps */}
      {["top-8 left-6", "top-8 right-6", "bottom-8 left-6", "bottom-8 right-6"].map((pos, i) => (
        <motion.div
          key={pos}
          className={`pointer-events-none absolute ${pos} text-3xl`}
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, delay: i * 0.6 }}
        >
          🪔
        </motion.div>
      ))}

      {/* Scattered floating flowers */}
      {[
        { emoji: "🪷", x: 12, y: 18 },
        { emoji: "🌺", x: 75, y: 12 },
        { emoji: "🌸", x: 88, y: 55 },
        { emoji: "🪷", x: 8, y: 65 },
        { emoji: "🌺", x: 45, y: 8 },
      ].map(({ emoji, x, y }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-xl opacity-30"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 20, -20, 0],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 5 + i * 0.7, delay: i * 0.5 }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Title */}
      <motion.div
        className="z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          🏺 කන මුට්ටි බිඳීම
        </h1>
        <p className="mt-2 text-lg font-semibold text-festive-orange">
          Pick a pot to find the treasure!
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {MAX_PICKS_PER_TRY} picks per try · {MAX_TRIES} tries
        </p>
      </motion.div>

      {/* Try & Pick counters */}
      <div className="z-10 flex items-center gap-3">
        <div className="rounded-full border border-border bg-card/80 px-5 py-2 text-sm font-bold text-foreground shadow-sm backdrop-blur-sm">
          Try {currentTry} / {MAX_TRIES}
        </div>
        <div className="rounded-full border border-border bg-card/80 px-5 py-2 text-sm font-semibold text-muted-foreground shadow-sm backdrop-blur-sm">
          Pick {picksThisTry} / {MAX_PICKS_PER_TRY}
        </div>
      </div>

      {/* Pots */}
      <div className="z-10 flex flex-wrap justify-center gap-5">
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
                ${isWin ? "border-[hsl(var(--win))] bg-[hsl(var(--win)/0.1)] shadow-xl shadow-[hsl(var(--win)/0.25)]" : ""}
                ${isLoss ? "border-muted bg-muted/30 opacity-50 grayscale" : ""}
                ${isClickable ? "cursor-pointer border-[hsl(var(--pot)/0.3)] bg-card/70 backdrop-blur-sm hover:border-[hsl(var(--pot))] hover:bg-card hover:shadow-xl hover:shadow-[hsl(var(--gold)/0.35)]" : ""}
                ${!isClickable && !isRevealed ? "cursor-default border-border bg-card/50 opacity-40" : ""}
              `}
              whileHover={isClickable ? { scale: 1.1, y: -8 } : {}}
              whileTap={isClickable ? { scale: 0.92 } : {}}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isLoss ? 0.5 : 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 180 }}
            >
              <motion.img
                src={isRevealed ? (isWin ? potWin : potEmpty) : clayPot}
                alt={`මුට්ටිය ${i + 1}`}
                className="h-20 w-20 object-contain drop-shadow-md"
                width={80}
                height={80}
                animate={isWin ? { rotate: [0, -6, 6, 0], scale: [1, 1.1, 1] } : {}}
                transition={isWin ? { repeat: 3, duration: 0.3 } : {}}
              />
              <span
                className={`mt-2 text-xs font-bold ${
                  isWin ? "text-[hsl(var(--win))]" : "text-muted-foreground"
                }`}
              >
                Pot {i + 1}
              </span>
              {isClickable && (
                <motion.div
                  className="pointer-events-none absolute -top-1 -right-1 text-lg"
                  animate={{ scale: [1, 1.4, 1], rotate: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.25 }}
                >
                  ✨
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Waiting for next try */}
      <AnimatePresence>
        {waitingForNextTry && (
          <motion.div
            className="z-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-lg font-bold text-festive-orange">
              😅 මේ පාරට නෑ! ඊළඟ උත්සාහය බලමු…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Result with Discount Code */}
      <AnimatePresence>
        {won === true && (
          <motion.div
            className="z-10 flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-3xl font-bold text-[hsl(var(--win))]">
              🎉 සුභ අලුත් අවුරුද්දක් වේවා!
            </p>
            <p className="text-lg text-festive-orange">
              ඔබට වාසනාව හිමි වුණා! 🥳
            </p>

            {/* Discount code card */}
            <motion.div
              className="relative mt-2 overflow-hidden rounded-2xl border-2 border-[hsl(var(--gold))] bg-card/90 px-8 py-5 shadow-2xl shadow-[hsl(var(--gold)/0.3)] backdrop-blur-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Shimmering effect */}
              <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.15)] to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
              <p className="text-sm font-semibold text-muted-foreground">
                🎁 ඔබේ වට්ටම් කේතය
              </p>
              <p className="mt-1 font-mono text-3xl font-black tracking-widest text-foreground">
                {DISCOUNT_CODE}
              </p>
              <motion.button
                onClick={copyCode}
                className="mt-3 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? "✅ පිටපත් කළා!" : "📋 කේතය පිටපත් කරන්න"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {won === false && (
          <motion.div
            className="z-10 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-2xl font-bold text-[hsl(var(--lose))]">
              😢 අපොයි! මේ පාරට වාසනාව නෑ
            </p>
            <p className="mt-1 text-muted-foreground">
              ඊළඟ පාරට වාසනාව ඔබට හිමි වේවා! 🙏
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {gameOver && (
        <motion.button
          onClick={reset}
          className="z-10 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:brightness-110"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏺 නැවත ක්‍රීඩා කරන්න
        </motion.button>
      )}

      {/* Confetti */}
      {showConfetti &&
        confettiEmojis.map((emoji, i) => (
          <FloatingEmoji key={i} emoji={emoji} delay={i * 0.1} />
        ))}
    </div>
  );
};

export default Index;
