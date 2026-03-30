import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import clayPot from "@/assets/clay-pot.png";
import potWin from "@/assets/pot-broken-win.png";
import potEmpty from "@/assets/pot-broken-empty.png";

const TOTAL_POTS = 5;
const MAX_PICKS_PER_TRY = 2;
const MAX_TRIES = 2;

const confettiEmojis = ["🌸", "💮", "✨", "🎊", "🏺", "🏵️"];

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

const CursorBat = ({ isSwinging, isMobile, forceX, forceY }: { isSwinging: boolean, isMobile: boolean, forceX?: number, forceY?: number }) => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Zero-lag instantaneous spring for desktop
  const springConfig = { damping: 25, stiffness: 1000, mass: 0.05 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, isMobile]);

  useEffect(() => {
    if (isMobile && forceX !== undefined && forceY !== undefined && isSwinging) {
      cursorX.set(forceX);
      cursorY.set(forceY);
    }
  }, [isMobile, forceX, forceY, isSwinging, cursorX, cursorY]);

  if (isMobile && !isSwinging) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[100] top-0 left-0"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    >
      <motion.div
        className="origin-bottom-left"
        initial={{ rotate: 15 }}
        animate={{ rotate: isSwinging ? 90 : 15 }} // 75-degree downward swing
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{ x: "-30%", y: "-90%" }}
      >
        <svg width="60" height="200" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          <defs>
            <linearGradient id="batGold" x1="0" y1="0" x2="60" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCF6BA" />
              <stop offset="35%" stopColor="#BF953F" />
              <stop offset="70%" stopColor="#AA771C" />
              <stop offset="100%" stopColor="#6C4910" />
            </linearGradient>
            <linearGradient id="batGrip" x1="0" y1="150" x2="60" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2A1B00" />
              <stop offset="100%" stopColor="#1A1100" />
            </linearGradient>
          </defs>
          {/* Main Stick */}
          <rect x="15" y="10" width="30" height="180" rx="15" fill="url(#batGold)" stroke="#FFF" strokeWidth="1" strokeOpacity="0.3" />
          {/* Grip */}
          <rect x="15" y="140" width="30" height="50" rx="15" fill="url(#batGrip)" />
          {/* Decorative Wraps */}
          <rect x="13" y="145" width="34" height="4" fill="#BF953F" />
          <rect x="13" y="155" width="34" height="4" fill="#BF953F" />
          <rect x="13" y="165" width="34" height="4" fill="#BF953F" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

const HighContrastShatterFragment = ({ index }: { index: number }) => {
  const angle = (index * 45 * Math.PI) / 180;
  const distance = 120 + Math.random() * 100;
  return (
    <motion.div
      className="absolute h-5 w-5"
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: Math.random() * 360 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.1,
        rotate: 720,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }} 
      style={{
        background: index % 2 === 0 ? "#D4AF37" : "#FFB6C1",
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        boxShadow: "0 0 20px rgba(212, 175, 55, 0.8)",
      }}
    />
  );
};

interface IndexProps {
  phone: string;
}

const API_URL = "https://script.google.com/macros/s/AKfycbwqMpKwlOkMYp45ZzEDN6Q7GoXxWHgRwXg77PYCo6_ueSsjklCGxINDH-HbuCk_R9NO/exec";

const Index = ({ phone }: IndexProps) => {
  const [currentTry, setCurrentTry] = useState(1);
  const [picksThisTry, setPicksThisTry] = useState(0);
  const [revealedPots, setRevealedPots] = useState<Set<number>>(new Set());
  const [won, setWon] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pendingNextTry, setPendingNextTry] = useState(false);
  const [winningPot] = useState(() => Math.floor(Math.random() * TOTAL_POTS));
  const [apiLoading, setApiLoading] = useState(false);

  // Bat & Shake state
  const [isSwinging, setIsSwinging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [mobileStrikePos, setMobileStrikePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Use lg breakpoint for "mobile" interaction
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePick = useCallback(
    (index: number, e: React.MouseEvent | React.TouchEvent) => {
      const isRevealed = revealedPots.has(index);
      const isGameOver = won !== null;
      if (isGameOver || isRevealed || pendingNextTry || apiLoading) return;

      // Track mobile touch for bat spawn
      if ("touches" in e) {
        setMobileStrikePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }

      // 1. Swing animation starts immediately
      setIsSwinging(true);
      setTimeout(() => setIsSwinging(false), 200);

      // 2. Impact point (approx 100ms after swing starts)
      setTimeout(() => {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 300); // 300ms shake duration

        const nextPicks = picksThisTry + 1;
        setPicksThisTry(nextPicks);
        setRevealedPots((prev) => new Set(prev).add(index));

        if (index === winningPot) {
          setApiLoading(true);

          fetch(API_URL, {
            method: "POST",
            mode: "cors",
            redirect: "follow",
            body: JSON.stringify({ action: "win", phone, code: "AVURUDU2026" }),
          }).then(async (res) => {
            await res.text();
            setApiLoading(false);
            setWon(true);
            setShowConfetti(true);
          }).catch(() => {
            setApiLoading(false);
            setWon(true);
            setShowConfetti(true);
          });
        } else if (nextPicks >= MAX_PICKS_PER_TRY) {
          if (currentTry >= MAX_TRIES) {
            setTimeout(() => setWon(false), 900);
          } else {
            setTimeout(() => setPendingNextTry(true), 1200);
          }
        }
      }, 120);
    },
    [revealedPots, won, pendingNextTry, picksThisTry, winningPot, currentTry, apiLoading, phone]
  );

  const startNextTry = () => {
    setCurrentTry(prev => prev + 1);
    setPicksThisTry(0);
    setRevealedPots(new Set());
    setPendingNextTry(false);
  };

  const gameOver = won !== null;
  const canRetry = pendingNextTry && currentTry < MAX_TRIES;
  const finalLoss = won === false;

  return (
    <>
      <CursorBat isSwinging={isSwinging} isMobile={isMobile} forceX={mobileStrikePos.x} forceY={mobileStrikePos.y} />
      
      <motion.div 
        animate={screenShake ? { x: [-8, 8, -5, 5, -2, 2, 0], y: [-3, 3, -2, 2, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden p-6 transition-colors duration-700 ${!isMobile ? 'cursor-none' : ''}`}
        style={{
          background: "linear-gradient(135deg, #FFD1DC 0%, #FFF8F0 40%, #FFF8F0 70%, #FFD1DC 100%)",
        }}
      >
        {/* Premium Vignette Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,rgba(252,200,180,0.18)_100%)] mix-blend-multiply" />
        
        {/* Subtle Decorative Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Header Section */}
        <motion.div
          className="z-10 text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="mb-3 text-5xl font-black tracking-widest sm:text-7xl drop-shadow-sm"
            style={{
              background: "linear-gradient(90deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            කණාමුට්ටිය
          </h1>
          <p className="text-xs font-bold tracking-[0.4em] text-black/50 uppercase">
            ✦ Avurudu Challenge ✦
          </p>
        </motion.div>

        {/* Status Area */}
        {!gameOver && !canRetry && (
          <motion.div 
            className="z-10 flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="rounded-full border border-black/5 bg-white/20 px-8 py-2.5 text-sm font-bold backdrop-blur-xl shadow-sm text-black/70">
              Try <span className="text-[#BF953F] px-1 text-base">{currentTry}</span> of {MAX_TRIES}
            </div>
          </motion.div>
        )}

        {/* Pot Arena (Exactly 5 in a single row) */}
        <div className="z-10 flex flex-nowrap justify-center gap-2 sm:gap-6 w-full max-w-5xl px-4">
          {Array.from({ length: TOTAL_POTS }).map((_, i) => {
            const isRevealed = revealedPots.has(i);
            const isWin = i === winningPot && isRevealed;
            const isLoss = i !== winningPot && isRevealed;
            const isInteractable = !isRevealed && !gameOver && !canRetry && !apiLoading;

            return (
              <motion.div
                key={`${currentTry}-${i}`}
                className="relative flex justify-center basis-[18%] sm:basis-[16%]"
                style={{ transformOrigin: "50% -300px" }}
                animate={{
                  rotate: isRevealed ? 0 : [-3, 3, -3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                {/* Thin Gold String */}
                {!isRevealed && (
                  <div className="absolute -top-[300px] left-1/2 h-[300px] w-[1px] -translate-x-1/2 bg-gradient-to-t from-[#D4AF37] to-transparent" />
                )}

                <motion.button
                  onMouseDown={(e) => handlePick(i, e)}
                  onTouchStart={(e) => handlePick(i, e)}
                  disabled={!isInteractable}
                  className={`group relative flex flex-col items-center justify-center transition-all duration-500
                    ${isLoss ? "opacity-0 scale-50" : ""}
                    ${!isInteractable && !isRevealed ? "opacity-30 grayscale saturate-0" : ""}
                  `}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.08 + 0.2, type: "spring", stiffness: 100 }}
                  whileHover={isInteractable ? { scale: 1.05, y: -5 } : {}}
                  whileTap={isInteractable ? { scale: 0.95 } : {}}
                >
                  {/* High Contrast Shatter Effect */}
                  {isRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <HighContrastShatterFragment key={idx} index={idx} />
                      ))}
                    </div>
                  )}

                  {/* 3D Shaded Pot Image */}
                  <div className={`relative ${isRevealed ? '' : 'drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_25px_25px_rgba(191,149,63,0.3)] transition-all duration-300'}`}>
                    <img
                      src={isRevealed ? (isWin ? potWin : potEmpty) : clayPot}
                      alt="Pot"
                      className={`h-36 w-36 sm:h-44 sm:w-44 object-contain ${isRevealed ? 'scale-110' : ''}`}
                    />
                    
                    {/* Gold Rim Overlay for Unrevealed Pots */}
                    {!isRevealed && (
                      <div className="absolute top-[8%] left-[23%] h-[15%] w-[54%] rounded-[100%] border-t-[3px] border-[#FCF6BA] opacity-60 mix-blend-overlay pointer-events-none" />
                    )}
                  </div>

                  {isInteractable && isMobile && (
                    <motion.div
                      className="absolute -bottom-6 text-[10px] font-bold tracking-widest uppercase text-[#BF953F] opacity-70"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Tap to Strike
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* UI Overlays */}
        <AnimatePresence>
          {canRetry && (             <motion.div
              className="z-20 flex flex-col items-center gap-5 text-center bg-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-[#D4AF37]"
              style={{ boxShadow: "0 8px 32px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <p className="text-2xl font-black text-black/80 uppercase tracking-widest">
                Missed! 🏺
              </p>
              <p className="text-sm font-semibold text-black/60 max-w-[220px] leading-relaxed">
                That was an empty pot. You have one final chance to find the treasure.
              </p>
              <motion.button
                onClick={startNextTry}
                className="mt-4 px-12 py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-xl transition-shadow hover:shadow-[0_10px_30px_rgba(191,149,63,0.3)]"
                style={{
                  background: "linear-gradient(90deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
                  color: "#1A1100",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Strike Again
              </motion.button>
            </motion.div>
          )}

          {won === true && (
            <motion.div
              className="z-20 flex flex-col items-center gap-6 text-center bg-white/10 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-[#D4AF37] max-w-sm"
              style={{ boxShadow: "0 8px 32px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FCF6BA] to-[#BF953F] shadow-[0_0_20px_rgba(212,175,55,0.6)] mb-2">
                <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-1">
                <p className="text-5xl font-black text-[#D4AF37] drop-shadow-sm tracking-tighter" style={{ textShadow: "0 2px 10px rgba(212,175,55,0.3)" }}>
                  VICTORY!
                </p>
              </div>

              <div className="relative w-full overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-white/40 p-6 shadow-inner mt-2">
                <p className="text-sm font-bold text-black/80 leading-relaxed">
                  Victory! Your discount code has been sent to your phone via SMS. Check your messages!
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-2xl font-black" style={{
                  background: "linear-gradient(90deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Subha Aluth Avuruddak Wewa!
                </p>
                <a href="/" className="inline-block text-[10px] uppercase font-black tracking-[0.2em] text-black/40 border-b border-black/20 pb-0.5 hover:text-[#BF953F] hover:border-[#BF953F] transition-colors">
                  Return to Website →
                </a>
              </div>
            </motion.div>
          )}

          {finalLoss && (             <motion.div
              className="z-20 flex flex-col items-center gap-6 text-center bg-white/10 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-[#D4AF37] max-w-sm"
              style={{ boxShadow: "0 8px 32px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="space-y-2">
                <p className="text-4xl font-black text-black/80 uppercase tracking-tighter">Oh No! 🍂</p>
                <p className="text-sm font-semibold text-black/60 leading-relaxed">
                  No attempts remaining. Subha Aluth Avuruddak Wewa!
                </p>
              </div>
              
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-2" />

              <p className="text-2xl font-black" style={{
                background: "linear-gradient(90deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                සුභ අලුත් අවුරුද්දක් වේවා!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {showConfetti &&
          confettiEmojis.map((emoji, i) => (
            <FloatingEmoji key={i} emoji={emoji} delay={i * 0.1} />
          ))}
      </motion.div>
    </>
  );
};

export default Index;
