import { motion, AnimatePresence } from "framer-motion";

interface PotProps {
  index: number;
  onClick: (index: number) => void;
  isBroken: boolean;
  disabled: boolean;
}

export const Pot = ({ index, onClick, isBroken, disabled }: PotProps) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Rope */}
      <div className="w-1 h-16 bg-[#8B4513] origin-top opacity-80" />
      
      <AnimatePresence mode="wait">
        {!isBroken ? (
          <motion.div
            key="intact-pot"
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5 + index * 0.2, // Offset timings slightly per pot
              ease: "easeInOut"
            }}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={() => !disabled && onClick(index)}
            className={`w-20 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-xl
              bg-gradient-to-br from-[#c85a17] to-[#8b3100] border-t-[6px] border-[#6b2500] z-10 relative
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#d66a27] hover:to-[#9f3a00]'}`}
            style={{ transformOrigin: "top center" }}
          >
            {/* Pot decoration details -> Liyawel inspired simple stripes */}
            <div className="w-full h-1 bg-[#ffdb58]/40 my-1" />
            <div className="w-[90%] h-[2px] bg-[#ffdb58]/30 my-1" />
            <div className="w-full h-1 bg-[#ffdb58]/40 my-1" />
          </motion.div>
        ) : (
          <motion.div 
            key="broken-pot"
            className="w-20 h-24 relative z-10 flex justify-center items-center"
          >
            {/* Shards blowing apart */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                animate={{ 
                  opacity: 0, 
                  x: (Math.random() - 0.5) * 150, 
                  y: (Math.random()) * 120,
                  rotate: (Math.random() - 0.5) * 500,
                  scale: 0.2
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-6 h-6 bg-gradient-to-br from-[#c85a17] to-[#8b3100]"
                style={{ 
                  clipPath: i % 2 === 0 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "polygon(0 0, 100% 0, 50% 100%)" 
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
