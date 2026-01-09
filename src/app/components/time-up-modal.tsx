import { motion, AnimatePresence } from "motion/react";
import { Trophy, Sparkles, Gift } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface TimeUpModalProps {
  isOpen: boolean;
  assignedPrize?: string | null;
  onContinue: () => void;
}

export function TimeUpModal({ isOpen, assignedPrize, onContinue }: TimeUpModalProps) {
  const [showPrize, setShowPrize] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Activar confetti cuando se muestra el premio
  useEffect(() => {
    if (showPrize) {
      setConfettiActive(true);
      // Confetti manual con canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const confetti: Array<{
        x: number;
        y: number;
        r: number;
        d: number;
        color: string;
        tilt: number;
        tiltAngleIncrement: number;
        tiltAngle: number;
      }> = [];

      const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

      for (let i = 0; i < 150; i++) {
        confetti.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          r: Math.random() * 6 + 4,
          d: Math.random() * confetti.length,
          color: colors[Math.floor(Math.random() * colors.length)],
          tilt: Math.floor(Math.random() * 10) - 10,
          tiltAngleIncrement: Math.random() * 0.07 + 0.05,
          tiltAngle: 0,
        });
      }

      let animationId: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((c) => {
          ctx.beginPath();
          ctx.lineWidth = c.r;
          ctx.strokeStyle = c.color;
          ctx.moveTo(c.x + c.tilt + c.r, c.y);
          ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
          ctx.stroke();

          c.tiltAngle += c.tiltAngleIncrement;
          c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
          c.tilt = Math.sin(c.tiltAngle - c.r / 2) * 15;

          if (c.y > canvas.height) {
            c.y = -c.r;
            c.x = Math.random() * canvas.width;
          }
        });

        animationId = requestAnimationFrame(animate);
      };

      animate();

      // Detener confetti después de 5 segundos
      setTimeout(() => {
        cancelAnimationFrame(animationId);
        setConfettiActive(false);
      }, 5000);

      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [showPrize]);

  const handleContinue = () => {
    if (!showPrize) {
      // Primero mostrar el premio
      setShowPrize(true);
    } else {
      // Luego continuar
      onContinue();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Canvas para confetti */}
          {confettiActive && (
            <canvas
              ref={canvasRef}
              className="fixed inset-0 pointer-events-none z-[60]"
            />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-amber-500/30"
            >
              {!showPrize ? (
                // Primera pantalla: Tiempo terminado
                <div className="p-8 sm:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-6"
                  >
                    <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-amber-500 mx-auto drop-shadow-lg" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl font-black text-white mb-4"
                  >
                    ¡Tiempo Terminado!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed"
                  >
                    Felicitaciones por participar en este desafío.{" "}
                    <span className="text-amber-400 font-bold">
                      Tu esfuerzo no pasó desapercibido.
                    </span>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-amber-400 mb-8"
                  >
                    <Sparkles className="w-6 h-6" />
                    <span className="text-sm font-medium">
                      ¡Tenés un premio esperándote!
                    </span>
                    <Sparkles className="w-6 h-6" />
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
                  >
                    Ver mi Premio
                  </motion.button>
                </div>
              ) : (
                // Segunda pantalla: Raspa y gana
                <div className="p-8 sm:p-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-6"
                  >
                    <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                      ¡Raspa y Descubrí tu Premio!
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base">
                      Deslizá tu dedo sobre la tarjeta para revelar tu premio
                    </p>
                  </motion.div>

                  <ScratchCard assignedPrize={assignedPrize} onReveal={handleContinue} />
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Componente de tarjeta de raspar
function ScratchCard({ assignedPrize, onReveal }: { assignedPrize?: string | null; onReveal: () => void }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedPercent, setRevealedPercent] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratching = useRef(false);

  // Usar el premio que ya fue asignado cuando se completó el formulario
  const selectedPrize = assignedPrize ? `🎁 ${assignedPrize}` : "🎁 Premio Sorpresa";
  const loadingPrize = false; // Ya no necesita cargar, el premio viene como prop

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return; // No redibujar si ya está revelado

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Dibujar fondo de la tarjeta
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1e293b");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar patrón de rayas
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    // Texto "RASPA AQUÍ"
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RASPA AQUÍ", canvas.width / 2, canvas.height / 2);

    // Función para raspar
    const scratch = (e: MouseEvent | TouchEvent) => {
      if (isRevealed) return; // No raspar si ya está revelado
      
      isScratching.current = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
      const y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

      // Usar composición para "borrar" el área raspada
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Calcular porcentaje revelado (aproximado)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentPixels = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparentPixels++;
      }
      const percent = (transparentPixels / (imageData.data.length / 4)) * 100;
      setRevealedPercent(percent);

      if (percent > 40 && !isRevealed) {
        setIsRevealed(true);
        // NO llamar a onReveal automáticamente, solo marcar como revelado
      }
    };

    const stopScratching = () => {
      isScratching.current = false;
    };

    canvas.addEventListener("mousedown", scratch);
    canvas.addEventListener("mousemove", (e) => {
      if (isScratching.current) scratch(e);
    });
    canvas.addEventListener("mouseup", stopScratching);
    canvas.addEventListener("mouseleave", stopScratching);
    canvas.addEventListener("touchstart", scratch);
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (isScratching.current) scratch(e);
    });
    canvas.addEventListener("touchend", stopScratching);

    return () => {
      canvas.removeEventListener("mousedown", scratch);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("mouseup", stopScratching);
      canvas.removeEventListener("mouseleave", stopScratching);
      canvas.removeEventListener("touchstart", scratch);
      canvas.removeEventListener("touchmove", scratch);
      canvas.removeEventListener("touchend", stopScratching);
    };
  }, [isRevealed]); // Remover onReveal de las dependencias

  return (
    <div className="relative">
      {/* Contenedor del premio con altura fija */}
      <div className="relative min-h-[200px] sm:min-h-[250px] rounded-xl bg-gradient-to-br from-amber-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-sm overflow-hidden">
        {/* Premio siempre visible debajo con mejor contraste */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 p-6">
          <div className="text-center px-4 w-full">
            {loadingPrize ? (
              <div className="text-white text-lg">Cargando premio...</div>
            ) : (
              <>
                <div 
                  className="text-4xl sm:text-5xl mb-4 break-words font-black"
                  style={{
                    color: '#FFFFFF',
                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8), 0 0 60px rgba(251, 191, 36, 0.4)',
                    WebkitTextStroke: '1px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {selectedPrize}
                </div>
                <p 
                  className="font-bold text-xl sm:text-2xl"
                  style={{
                    color: '#FFFFFF',
                    textShadow: '0 0 15px rgba(251, 191, 36, 0.7), 0 2px 4px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  ¡Felicitaciones!
                </p>
              </>
            )}
          </div>
        </div>

        {/* Canvas de raspa encima - solo mostrar si no está completamente revelado */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-xl cursor-crosshair touch-none z-10"
            style={{ touchAction: "none" }}
          />
        )}
        
        {!isRevealed && (
          <p className="absolute bottom-2 left-0 right-0 text-center text-slate-400 text-xs z-20">
            {Math.round(revealedPercent)}% revelado
          </p>
        )}
      </div>
      
      {/* Botón para continuar cuando está revelado - FUERA y DEBAJO del contenedor del premio */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReveal}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Continuar
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
