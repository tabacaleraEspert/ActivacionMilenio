import { motion } from "motion/react";
import { Trophy, RotateCcw } from "lucide-react";

interface ClosingSectionProps {
  onPlayAgain: () => void;
  assignedPrize?: string | null;
}

export function ClosingSection({ onPlayAgain, assignedPrize }: ClosingSectionProps) {

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Trophy animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="mb-6 sm:mb-8"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "transform" }}
            className="inline-block"
          >
            <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-amber-500 drop-shadow-2xl" strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Confetti-like elements - reduced for mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -100,
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                rotate: Math.random() * 360,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                delay: Math.random() * 2,
                ease: "linear",
              }}
              className={`absolute w-3 h-3 ${
                i % 3 === 0
                  ? "bg-yellow-300"
                  : i % 3 === 1
                  ? "bg-pink-300"
                  : "bg-cyan-300"
              }`}
              style={{
                clipPath:
                  i % 2 === 0
                    ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                    : "circle(50%)",
                willChange: "transform"
              }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg relative z-10"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        >
          ¡Increíble!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-white mb-3 sm:mb-4 drop-shadow-md relative z-10"
        >
          Gracias por jugar
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base sm:text-lg text-white/90 mb-10 sm:mb-12 max-w-lg mx-auto relative z-10 px-4"
        >
          Tu memoria está en forma. ¿Querés mejorar tu marca?
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center relative z-10"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onPlayAgain}
            className="bg-amber-500 text-white px-8 sm:px-10 py-5 sm:py-5 rounded-full font-black text-base sm:text-lg shadow-2xl shadow-amber-500/30 active:shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2 min-h-[56px] touch-manipulation"
          >
            <RotateCcw className="w-5 h-5" />
            Jugar de nuevo
          </motion.button>
        </motion.div>

        {/* Premio ganado */}
        {assignedPrize && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 sm:mt-10 relative z-10"
          >
            <div className="bg-gradient-to-br from-amber-600/40 via-purple-600/40 to-pink-600/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-xl">
              <p className="text-white text-sm sm:text-base font-medium mb-3 text-center">
                Tu premio
              </p>
              <p 
                className="text-3xl sm:text-4xl font-black text-center break-words"
                style={{
                  color: '#FFFFFF',
                  textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8), 0 0 60px rgba(251, 191, 36, 0.4)',
                  WebkitTextStroke: '1px rgba(0, 0, 0, 0.5)',
                }}
              >
                🎁 {assignedPrize}
              </p>
            </div>
          </motion.div>
        )}

        {/* Brand message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 sm:mt-16 relative z-10"
        >
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/30">
            <p className="text-white text-base sm:text-lg font-medium mb-2">
              Una experiencia de
            </p>
            <p className="text-3xl sm:text-4xl font-black text-white">
              MILENIO
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}