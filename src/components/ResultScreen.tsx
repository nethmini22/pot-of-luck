import React from "react";
import { motion } from "framer-motion";

interface ResultScreenProps {
  status: "won" | "lost_retry" | "game_over";
  onRetry?: () => void;
}

export const ResultScreen = ({ status, onRetry }: ResultScreenProps) => {
  const isWin = status === "won";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        className="glass-card w-full max-w-md p-10 rounded-3xl flex flex-col items-center text-center space-y-6 z-10 border-2 border-white/50 shadow-2xl"
      >
        {isWin ? (
          <>
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
              className="text-4xl md:text-5xl font-extrabold text-deep-red mb-2 text-glow"
            >
              Subha Aluth Avuruddak Wewa!
            </motion.h1>
            <p className="text-xl text-foreground font-semibold">
              Congratulations! You broke the winning mutti!
            </p>
            <div className="bg-gold/10 border-2 border-gold border-dashed rounded-xl p-6 w-full shadow-inner mt-4">
              <p className="text-sm font-semibold tracking-widest text-[#8b4513] mb-2 uppercase">Your Discount Code</p>
              <p className="text-3xl font-black text-festive-orange tracking-widest">AVURUDU2026</p>
            </div>
            
            <div className="flex gap-6 mt-6 text-4xl">
              <motion.span animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}>🎉</motion.span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}>✨</motion.span>
              <motion.span animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}>🎊</motion.span>
            </div>
          </>
        ) : status === "lost_retry" ? (
          <>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Oh no!
            </h1>
            <p className="text-xl text-foreground/80">
              That pot was just water.
            </p>
            <motion.div 
              initial={{ rotate: -10 }} 
              animate={{ rotate: 10 }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.2 }}
              className="text-7xl my-6"
            >
              💧
            </motion.div>
            <button
              onClick={onRetry}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-festive-orange to-gold text-white px-6 py-4 font-bold text-xl transition-transform active:scale-95 shadow-lg"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors" />
              Try Again (1 Strike Left)
            </button>
          </>
        ) : (
          <>
             <h1 className="text-5xl font-black text-deep-red mb-2 uppercase tracking-wide">
              Game Over
            </h1>
            <p className="text-xl text-foreground/80 font-medium">
              Better luck next time! You've used all your strikes.
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-7xl my-6"
            >
              🏺
            </motion.div>
            <p className="text-sm text-foreground/60 italic mt-4">Refresh the page to start over.</p>
          </>
        )}
      </motion.div>
    </div>
  );
};
