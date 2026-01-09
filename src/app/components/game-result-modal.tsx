import { motion, AnimatePresence } from "motion/react";
import { Trophy, X, Frown, Share2 } from "lucide-react";

interface GameResultModalProps {
  isOpen: boolean;
  won: boolean;
  progress: number;
  timePassed: number;
  onClose: () => void;
  onContinue: () => void;
}

export function GameResultModal({
  isOpen,
  won,
  progress,
  timePassed,
  onClose,
  onContinue,
}: GameResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {won ? (
              // GANASTE
              <div className="relative overflow-hidden">
                {/* Confetti background */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: Math.random() * 100 + "%",
                        y: -20,
                        rotate: Math.random() * 360,
                        scale: Math.random() * 0.5 + 0.5,
                      }}
                      animate={{
                        y: "100vh",
                        rotate: Math.random() * 720,
                      }}
                      transition={{
                        duration: Math.random() * 2 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          "#FFD700",
                          "#FF6B6B",
                          "#4ECDC4",
                          "#45B7D1",
                          "#FFA07A",
                        ][Math.floor(Math.random() * 5)],
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 p-8 text-center">
                  {/* Trophy animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      damping: 15,
                      stiffness: 200,
                      delay: 0.2,
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, -15, 15, -15, 15, 0],
                        scale: [1, 1.1, 1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4 drop-shadow-2xl filter" />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-black text-white mb-3 drop-shadow-lg"
                    style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                  >
                    ¡GANASTE!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-white/90 font-bold mb-6 drop-shadow-md"
                  >
                    ¡Memoria de campeón! 🎉
                  </motion.p>

                  {/* Stats */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-white/80 mb-1">
                          PROGRESO
                        </p>
                        <p className="text-3xl font-black text-white">
                          {Math.round(progress * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white/80 mb-1">
                          TIEMPO
                        </p>
                        <p className="text-3xl font-black text-white">
                          {Math.round(timePassed)}s
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onContinue}
                    className="w-full bg-white text-orange-600 px-8 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-6 h-6" />
                    Continuar
                  </motion.button>
                </div>
              </div>
            ) : (
              // PERDISTE
              <div className="relative overflow-hidden">
                {/* Dark background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800" />

                <div className="relative z-10 p-8 text-center">
                  {/* Sad face animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      damping: 15,
                      stiffness: 200,
                      delay: 0.2,
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Frown className="w-24 h-24 text-gray-300 mx-auto mb-4 drop-shadow-2xl" />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-black text-white mb-3 drop-shadow-lg"
                    style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                  >
                    ¡Casi!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-white/90 font-bold mb-6 drop-shadow-md"
                  >
                    No completaste el juego 😔
                  </motion.p>

                  {/* Stats */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-white/70 mb-1">
                          PROGRESO
                        </p>
                        <p className="text-3xl font-black text-white">
                          {Math.round(progress * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white/70 mb-1">
                          TIEMPO
                        </p>
                        <p className="text-3xl font-black text-white">
                          {Math.round(timePassed)}s
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mb-6">
                    ¡Intentá de nuevo en tu próxima visita!
                  </p>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onContinue}
                    className="w-full bg-white text-gray-800 px-8 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-2"
                  >
                    Continuar
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}