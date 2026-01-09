import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Videos locales desde la carpeta public
// En Vite, los archivos en public/ se sirven desde la raíz con /
const BRAND_VIDEOS = [
  "/Video1.mp4",
  "/Video2.mp4",
  "/Video3.mp4",
];

interface BrandMomentProps {
  onVideoComplete?: () => void;
}

export function BrandMoment({ onVideoComplete }: BrandMomentProps) {
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [videoError, setVideoError] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoTimeElapsed, setVideoTimeElapsed] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Seleccionar video aleatorio al montar
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BRAND_VIDEOS.length);
    const video = BRAND_VIDEOS[randomIndex];
    setSelectedVideo(video);
    console.log("🎬 Video seleccionado:", video);
    console.log("🎬 Ruta completa:", window.location.origin + video);
    setVideoLoading(true);
    setVideoError(false);
  }, []);

  // Verificar que el video existe cuando se selecciona
  useEffect(() => {
    if (!selectedVideo) return;

    // Verificar si el video se puede cargar
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      console.log("✅ Video cargado correctamente:", selectedVideo);
      setVideoLoading(false);
      setVideoError(false);
    };

    video.onerror = () => {
      console.error("❌ Error cargando video:", selectedVideo);
      setVideoError(true);
      setVideoLoading(false);
    };

    video.src = selectedVideo;
  }, [selectedVideo]);

  // Trackear tiempo del video para habilitar botón después de 15 segundos
  useEffect(() => {
    if (videoRef.current && !videoLoading && !videoError) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        const currentTime = video.currentTime;
        setVideoTimeElapsed(currentTime);
        
        // Habilitar botón después de 15 segundos
        if (currentTime >= 15 && !canSkip) {
          setCanSkip(true);
          console.log("✅ Botón de continuar habilitado (15 segundos transcurridos)");
        }
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoLoading, videoError, canSkip]);

  // Intentar siguiente video si falla
  useEffect(() => {
    if (videoError && selectedVideo) {
      const currentIndex = BRAND_VIDEOS.indexOf(selectedVideo);
      const nextIndex = (currentIndex + 1) % BRAND_VIDEOS.length;
      const nextVideo = BRAND_VIDEOS[nextIndex];
      
      console.log("⚠️ Video falló, intentando siguiente:", nextVideo);
      
      const timer = setTimeout(() => {
        if (currentIndex < BRAND_VIDEOS.length - 1) {
          setSelectedVideo(nextVideo);
          setVideoError(false);
          setVideoLoading(true);
        } else {
          // Si todos los videos fallaron, saltar
          console.log("⏭️ Todos los videos fallaron, saltando...");
          handleSkipVideo();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [videoError, selectedVideo]);

  const handleVideoEnd = () => {
    console.log("🎬 Video terminado!");
    setVideoEnded(true);
    // Cuando el video termina, habilitar el botón si no estaba habilitado
    setCanSkip(true);
  };

  const handleVideoError = (e: any) => {
    console.error("❌ Error en el elemento video");
    console.error("  - Event:", e);
    console.error("  - Video src:", selectedVideo);
    console.error("  - Video element:", videoRef.current);
    
    if (videoRef.current) {
      console.error("  - Video error code:", videoRef.current.error?.code);
      console.error("  - Video error message:", videoRef.current.error?.message);
    }
    
    setVideoError(true);
    setVideoLoading(false);
  };

  const handleVideoLoaded = () => {
    console.log("✅ Video cargado y listo para reproducir");
    setVideoLoading(false);
    setVideoError(false);
  };

  const handleSkipVideo = () => {
    console.log("⏭️ Video saltado por el usuario");
    if (onVideoComplete) {
      onVideoComplete();
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581917306533-63166366910d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjB0cm9waWNhbCUyMHZpYmVzfGVufDF8fHx8MTc2NzcyNzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Summer vibes"
          loading="lazy"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/60" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              opacity: 0.3,
            }}
            animate={{
              y: -100,
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
            className="absolute w-2 h-2 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
          className="mb-6 sm:mb-8 flex justify-center"
        >
          <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 drop-shadow-lg" strokeWidth={2} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg leading-tight"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        >
          Estás a punto de jugar
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-8 sm:mb-12 drop-shadow-md"
        >
          Prepará tu memoria.<br />
          El desafío empieza ahora.
        </motion.p>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black"
        >
          {selectedVideo && (
            <video
              ref={videoRef}
              key={selectedVideo}
              autoPlay
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              onLoadedData={handleVideoLoaded}
              onCanPlay={handleVideoLoaded}
            >
              <source src={selectedVideo} type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
          )}

          {/* Loading overlay */}
          {videoLoading && !videoError && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 text-white" />
                </motion.div>
                <p className="text-sm font-medium px-4">
                  Cargando video...
                </p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {videoError && (
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 text-white" />
                <p className="text-sm font-medium mb-2">
                  No se pudo cargar el video
                </p>
                <p className="text-xs opacity-80">
                  {selectedVideo}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          {videoEnded ? (
            <p className="text-base sm:text-lg text-white/90 font-medium">
              Video finalizado. Presioná el botón para continuar al juego.
            </p>
          ) : canSkip ? (
            <p className="text-base sm:text-lg text-white/90 font-medium">
              Podés continuar al juego cuando quieras
            </p>
          ) : (
            <p className="text-base sm:text-lg text-white/90 font-medium">
              Disfrutá el video mientras se prepara el juego
            </p>
          )}
        </motion.div>

        {/* Continue button - Solo se muestra después de 15 segundos */}
        {canSkip && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkipVideo}
            className="mt-4 sm:mt-6 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-lg rounded-full shadow-2xl hover:shadow-amber-500/50 hover:bg-gradient-to-r hover:from-amber-600 hover:to-amber-700 transition-all"
          >
            Continuar al Juego
          </motion.button>
        )}
        
        {/* Mostrar tiempo transcurrido mientras no se puede saltar */}
        {!canSkip && !videoLoading && !videoError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-white/70"
          >
            {Math.round(videoTimeElapsed)}s / 15s
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
            className="w-1 h-2 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
