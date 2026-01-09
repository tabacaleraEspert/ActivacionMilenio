import { motion, AnimatePresence } from "motion/react";
import { Loader2, GamepadIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { TimeUpModal } from "./time-up-modal";

interface GameSectionProps {
  onGameComplete?: () => void;
  assignedPrize?: string | null;
}

interface GameResult {
  lastPlayedAt: number;
  correctUids: { [key: string]: boolean };
  timePassed: number;
  playerInput: any;
  progress: number;
  playerUid: string;
  activityKey: string;
  createdAt?: number;
  created_at?: number;
}

export function GameSection({ onGameComplete, assignedPrize }: GameSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [shouldLoadGame, setShouldLoadGame] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Controla si el juego realmente comenzó
  const [gameFinished, setGameFinished] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null); // 3, 2, 1, null
  const [timer, setTimer] = useState<number>(15); // Timer de 15 a 0
  const [timerActive, setTimerActive] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Función para enviar resultados al webhook de Supabase
  const sendResultToWebhook = async (result: GameResult) => {
    try {
      console.log("📤 Enviando resultado al webhook...");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(result),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Resultado enviado a webhook correctamente:", data);
      } else {
        const errorText = await response.text();
        console.error("❌ Error enviando resultado:", response.status, errorText);
      }
    } catch (error) {
      console.error("❌ Error enviando resultado al webhook:", error);
    }
  };

  // Función para iniciar el juego cuando el usuario presiona START
  const handleStartGame = () => {
    console.log("🎮 Usuario presionó START - Iniciando carga del juego...");
    setIsLoading(true); // Mostrar loading
    setTimer(15); // Resetear timer a 15
    setTimerActive(false); // Asegurar que el timer no esté activo aún
    setCountdown(null); // Resetear countdown
    setGameFinished(false); // Resetear estado de juego terminado
    setGameResult(null); // Resetear resultado
    // Cargar el iframe inmediatamente
    setShouldLoadGame(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log("✅ Iframe loaded successfully - Listening for postMessage events");
    
    // Iniciar el countdown: 3, 2, 1
    setCountdown(3);
    setGameStarted(true);
  };

  // Countdown: 3, 2, 1
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          // Countdown terminó, iniciar el timer
          setTimerActive(true);
          setGameStartTime(Date.now());
          console.log("⏰ Timer iniciado - 15 segundos");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  // Timer: 60 a 0
  useEffect(() => {
    if (!timerActive || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Timer terminó, mostrar modal
          setTimerActive(false);
          
          // Verificar resultado
          const currentResult = gameResult;
          if (!currentResult) {
            // Si no hay resultado, el usuario perdió
            setGameWon(false);
            setGameFinished(true);
          } else {
            let progress = currentResult.progress || 0;
            // Normalizar progress si viene como porcentaje
            if (progress > 1) {
              progress = progress / 100;
            }

            // Ganó si progress es 1 (100%)
            const won = progress === 1 || progress >= 0.99;
            
            console.log("⏰ Timer terminó - Verificando resultado:");
            console.log("  - Progress:", Math.round(progress * 100) + "%");
            console.log("  - Resultado: ", won ? "GANASTE 🎉" : "PERDISTE 😔");

            // Enviar resultado al webhook
            const normalizedData = { ...currentResult, progress };
            sendResultToWebhook(normalizedData);

            setGameWon(won);
            setGameFinished(true);
          }

          // Mostrar modal de tiempo terminado
          setShowTimeUpModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timer, gameResult]);



  useEffect(() => {
    // Listen for postMessage from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Filter out MetaMask and other browser extension messages
      if (event.data && typeof event.data === 'object') {
        // Ignore MetaMask messages
        if (event.data.target === 'metamask-inpage' || 
            event.data.name === 'metamask-provider' ||
            event.data.type === 'metamask') {
          console.log("🦊 MetaMask message ignored");
          return;
        }
        
        // Ignore other common extension messages
        if (event.data.type === 'webpackOk' || 
            event.data.type === 'webpackInvalid' ||
            event.data.source === 'react-devtools-bridge' ||
            event.data.source === 'react-devtools-content-script') {
          return;
        }
      }
      
      // Log ALL incoming messages for debugging (after filtering)
      console.log("🔔 postMessage received:");
      console.log("  - Origin:", event.origin);
      console.log("  - Data:", event.data);
      console.log("  - Type:", typeof event.data);
      
      // Try to parse the data
      if (event.data && typeof event.data === 'object') {
        console.log("📦 Object detected, checking structure...");
        console.log("  - Has 'progress'?", 'progress' in event.data);
        console.log("  - Has 'timePassed'?", 'timePassed' in event.data);
        console.log("  - Has 'playerUid'?", 'playerUid' in event.data);
        console.log("  - Has 'lastPlayedAt'?", 'lastPlayedAt' in event.data);
        console.log("  - Has 'gameFinished'?", 'gameFinished' in event.data);
        console.log("  - Has 'gameEnded'?", 'gameEnded' in event.data);
        
        // Check if it has the expected structure from puzzel.org
        // El juego envía estos datos cuando termina o durante el juego
        const hasGameData = 'progress' in event.data && 
                           'timePassed' in event.data && 
                           'playerUid' in event.data && 
                           'lastPlayedAt' in event.data;
        
        if (hasGameData) {
          const data = event.data as GameResult;
          let progress = data.progress || 0;
          const timePassed = data.timePassed || 0;
          
          // Normalizar progress: si viene como porcentaje (12.5) convertirlo a decimal (0.125)
          // Si progress > 1, significa que viene como porcentaje y hay que dividirlo por 100
          if (progress > 1) {
            progress = progress / 100;
          }
          
          // Obtener createdAt del juego (timestamp en milisegundos)
          const gameCreatedAt = data.createdAt || data.created_at;
          
          console.log("📊 Mensaje del juego recibido:");
          console.log("  - Progress (raw):", data.progress);
          console.log("  - Progress (normalized):", progress, "(" + Math.round(progress * 100) + "%)");
          console.log("  - Time Passed:", timePassed, "segundos");
          if (gameCreatedAt) {
            const createdAtDate = new Date(gameCreatedAt);
            const now = Date.now();
            const timeSinceCreated = (now - gameCreatedAt) / 1000;
            console.log("  - CreatedAt:", createdAtDate.toISOString());
            console.log("  - Tiempo desde createdAt:", Math.round(timeSinceCreated), "segundos");
          }
          console.log("  - Full data:", JSON.stringify(data, null, 2));
          
          // Solo guardar el progress durante el juego
          // El juego terminará cuando el timer llegue a 0
          const normalizedData = { ...data, progress };
          console.log("📊 Actualización durante el juego:", 
            Math.round(progress * 100) + "% completado");
          setGameResult(normalizedData);
        } else {
          console.log("⚠️ Message doesn't match expected game result structure");
        }
      } else {
        console.log("ℹ️ Message is not an object, type:", typeof event.data);
      }
    };

    console.log("👂 Event listener attached to window for postMessage");
    window.addEventListener("message", handleMessage);

    return () => {
      console.log("🔇 Event listener removed from window");
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black py-8 sm:py-12 px-4 sm:px-6 flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "transform" }}
            className="inline-block mb-4"
          >
            <GamepadIcon className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 drop-shadow-lg" strokeWidth={2} />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">
            ¡Hora de jugar!
          </h2>
          <p className="text-base sm:text-xl text-white/90 drop-shadow-md px-4">
            Encontrá todos los pares y demostrá tu memoria
          </p>

          {/* Timer arriba - Solo cuando el juego está activo */}
          {timerActive && countdown === null && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full shadow-2xl">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ⏱️ {timer}s
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative bg-slate-800 border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl"
          style={{ minHeight: "500px", overflow: "visible" }}
        >
          {/* Loading overlay */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center z-10"
            >
              <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 animate-spin mb-4" />
              <p className="text-lg sm:text-xl font-bold text-white animate-pulse">
                Preparando el juego...
              </p>
              <p className="text-sm text-slate-300 mt-2">
                ¡Un momento de paciencia!
              </p>
            </motion.div>
          )}

          {/* Pantalla de inicio con botón START */}
          {!shouldLoadGame && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900" style={{ minHeight: "800px" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-8"
                >
                  <GamepadIcon className="w-20 h-20 sm:w-24 sm:h-24 text-amber-500 mx-auto drop-shadow-lg" strokeWidth={2} />
                </motion.div>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 drop-shadow-lg">
                  ¿Listo para jugar?
                </h3>
                <p className="text-lg sm:text-xl text-white/80 mb-8 px-4">
                  Presioná START para comenzar el desafío
                </p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartGame}
                  className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-2xl sm:text-3xl rounded-full shadow-2xl hover:shadow-3xl transition-all"
                >
                  START
                </motion.button>
              </motion.div>
            </div>
          )}

          {/* Loading overlay - Solo cuando shouldLoadGame es true pero el iframe aún no carga */}
          {shouldLoadGame && isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center z-10"
            >
              <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 animate-spin mb-4" />
              <p className="text-lg sm:text-xl font-bold text-white animate-pulse">
                Preparando el juego...
              </p>
              <p className="text-sm text-slate-300 mt-2">
                ¡Un momento de paciencia!
              </p>
            </motion.div>
          )}

          {/* Countdown overlay - 3, 2, 1 */}
          {countdown !== null && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.h2
                key={countdown}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-9xl sm:text-[12rem] font-black text-white drop-shadow-2xl"
                style={{ textShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
              >
                {countdown}
              </motion.h2>
            </motion.div>
          )}

          {/* Game iframe - Solo renderizar cuando shouldLoadGame es true (después de presionar START) */}
          {shouldLoadGame && (
            <iframe
              ref={iframeRef}
              id="game-iframe"
              key="game-iframe-start"
              src="https://puzzel.org/en/memory/embed?p=-ObSmPgayI7Lr6PkxoLl"
              className="w-full h-full rounded-2xl sm:rounded-3xl"
              style={{ 
                minHeight: "800px", 
                border: "none",
                display: "block",
                opacity: countdown !== null && countdown > 0 ? 0.3 : 1
              }}
              title="Memotest Game"
              onLoad={handleIframeLoad}
              allow="autoplay"
            />
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 sm:mt-8 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 px-5 sm:px-6 py-3 rounded-full text-white">
            <span className="text-xl sm:text-2xl">💡</span>
            <p className="text-sm sm:text-base font-medium">
              Consejo: Concentrate y recordá los patrones
            </p>
          </div>

          {/* Complete button - Solo se muestra cuando el juego termina */}
          {gameFinished && onGameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-base sm:text-lg text-white/90 font-medium mb-4"
              >
                {gameWon ? "¡Felicitaciones! Completaste el juego." : "El tiempo se agotó. Continuá para ver tus resultados."}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGameComplete}
                className="mt-4 sm:mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all"
              >
                Continuar
              </motion.button>
            </motion.div>
          )}
        </motion.div>

      </motion.div>

      {/* Modal de tiempo terminado */}
      <TimeUpModal
        isOpen={showTimeUpModal}
        assignedPrize={assignedPrize}
        onContinue={() => {
          setShowTimeUpModal(false);
          if (onGameComplete) {
            onGameComplete();
          }
        }}
      />
    </section>
  );
}