import { useState, useRef, useEffect } from "react";
import { HeroSection } from "./components/hero-section";
import { RegistrationForm } from "./components/registration-form";
import { BrandMoment } from "./components/brand-moment";
import { GameSection } from "./components/game-section";
import { ClosingSection } from "./components/closing-section";
import { StatsSection } from "./components/stats-section";
// import { ResultsViewer } from "./components/results-viewer"; // Ocultado

type AppStep = "hero" | "form" | "brand" | "game" | "closing" | "stats";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  ageRange: string;
  brand: string;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("hero");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [assignedPrize, setAssignedPrize] = useState<string | null>(null);
  const [videoCompleted, setVideoCompleted] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Log setup info on mount
  useEffect(() => {
    console.log("%c🎮 Activación de Marca - Memotest", "font-size: 20px; font-weight: bold; color: #8B5CF6;");
    console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #8B5CF6;");
    console.log("%c📌 INFORMACIÓN IMPORTANTE", "font-size: 14px; font-weight: bold; color: #3B82F6;");
    console.log("%c", "");
    console.log("%c🔗 Webhook URL:", "font-weight: bold; color: #10B981;");
    console.log("   https://usbkamwrbvkorkmebbof.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results");
    console.log("%c", "");
    console.log("%c💾 Ver resultados guardados:", "font-weight: bold; color: #F59E0B;");
    console.log("   Click en el botón flotante morado abajo a la derecha →");
    console.log("%c", "");
    console.log("%c📝 Configuración:", "font-weight: bold; color: #EF4444;");
    console.log("   1. Abrí tu juego en puzzel.org");
    console.log("   2. Buscá 'Save via Webhook'");
    console.log("   3. Pegá la URL del webhook");
    console.log("   4. Guardá los cambios");
    console.log("%c", "");
    console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #8B5CF6;");
  }, []);

  // Auto-scroll to game after brand moment - REMOVED, now controlled by video completion
  // useEffect(() => {
  //   if (currentStep === "brand") {
  //     const timer = setTimeout(() => {
  //       setCurrentStep("game");
  //       setTimeout(() => {
  //         gameRef.current?.scrollIntoView({ behavior: "smooth" });
  //       }, 100);
  //     }, 5000); // 5 seconds to view brand moment
  //
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentStep]);


  const scrollToForm = () => {
    setCurrentStep("form");
  };

  const handleFormComplete = async (data: FormData) => {
    // Guardar datos Y asignar premio al mismo tiempo usando Google Apps Script directamente
    // Solución para CORS: usar no-cors para guardar datos y JSONP para obtener premio
    try {
      // URL del script para guardar datos
      const SAVE_DATA_URL = import.meta.env.VITE_GOOGLE_SCRIPT_SAVE_DATA_URL || 
        'https://script.google.com/macros/s/AKfycbxz4Mtt62__aabtFbMIoMmY7YOuqS2v5lOzpQDpNwC7hSmUWMIxUP4mOfMCKQzjp0vYHw/exec';
      
      // URL del script para asignar premios
      const ASSIGN_PRIZE_URL = import.meta.env.VITE_GOOGLE_SCRIPT_PRIZES_URL || 
        'https://script.google.com/macros/s/AKfycbyolBkatt3RA7hIUNq77T9igvo4AGdLSaA2J6vuvl_27F8e22mp4VY6m7cJ-lM-HTBKCg/exec';
      
      // 1. Guardar datos del formulario (usar no-cors para evitar preflight)
      console.log("💾 Guardando datos del formulario...");
      fetch(SAVE_DATA_URL, {
        method: "POST",
        mode: "no-cors", // Evita el preflight OPTIONS
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "saveFormData",
          ...data,
        }),
      }).catch((error) => {
        console.error("Error guardando datos:", error);
      });
      
      console.log("✅ Datos del formulario enviados a Google Sheets");
      
      // 2. Asignar premio usando JSONP (después de guardar datos)
      console.log("🎁 Asignando premio...");
      
      const prizePromise = new Promise<string | null>((resolve) => {
        // Crear función callback única
        const callbackName = `handlePrize_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Función que se ejecutará cuando el script cargue
        (window as any)[callbackName] = (response: any) => {
          console.log("📦 Respuesta del premio recibida:", response);
          
          if (response && response.success && response.prize) {
            console.log(`✅ Premio asignado: ${response.prize}`);
            resolve(response.prize);
          } else {
            console.warn("⚠️ Respuesta sin premio válido:", response);
            if (response && response.error) {
              console.error("❌ Error del servidor:", response.error);
            }
            resolve(null);
          }
          
          // Limpiar
          delete (window as any)[callbackName];
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
        
        // Crear script tag para JSONP
        const script = document.createElement('script');
        const url = `${ASSIGN_PRIZE_URL}?callback=${callbackName}`;
        console.log("🔗 URL del premio (JSONP):", url);
        
        script.src = url;
        script.async = true;
        
        script.onerror = (error) => {
          console.error("❌ Error cargando script JSONP:", error);
          resolve(null);
          delete (window as any)[callbackName];
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
        
        // Timeout de seguridad
        setTimeout(() => {
          if ((window as any)[callbackName]) {
            console.warn("⏱️ Timeout esperando respuesta del premio (5s)");
            resolve(null);
            delete (window as any)[callbackName];
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          }
        }, 5000);
        
        document.head.appendChild(script);
      });
      
      // Esperar el premio
      const prize = await Promise.race([
        prizePromise,
        new Promise<string | null>((resolve) => {
          setTimeout(() => {
            console.warn("⏱️ Timeout general esperando premio (6s)");
            resolve(null);
          }, 6000);
        })
      ]);
      
      if (prize) {
        setAssignedPrize(prize);
        console.log(`✅ Premio guardado en estado: ${prize}`);
      } else {
        console.warn("⚠️ No se pudo obtener el premio, continuando sin premio asignado");
      }
      
    } catch (error) {
      console.error("Error guardando datos o asignando premio:", error);
      // Continuar con el flujo aunque falle
    }
    
    setFormData(data);
    setCurrentStep("brand");
  };

  const handleBrandComplete = () => {
    console.log("🎬 Video completado - cargando juego...");
    setVideoCompleted(true);
    setCurrentStep("game");
  };

  const handleGameComplete = () => {
    setCurrentStep("closing");
  };

  const handlePlayAgain = () => {
    // Reset form data y premio
    setFormData(null);
    setAssignedPrize(null);
    setVideoCompleted(false);
    setCurrentStep("hero");
  };

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {/* Hero Section */}
      {currentStep === "hero" && (
        <HeroSection onScrollToForm={scrollToForm} />
      )}

      {/* Registration Form */}
      {currentStep === "form" && (
        <div ref={formRef}>
          <RegistrationForm onComplete={handleFormComplete} />
        </div>
      )}

      {/* Brand Moment */}
      {currentStep === "brand" && (
        <div ref={brandRef}>
          <BrandMoment onVideoComplete={handleBrandComplete} />
        </div>
      )}

      {/* Game Section */}
      {currentStep === "game" && (
        <div ref={gameRef}>
          <GameSection 
            onGameComplete={handleGameComplete}
            assignedPrize={assignedPrize}
          />
        </div>
      )}

      {/* Closing Section */}
      {currentStep === "closing" && (
        <div ref={closingRef}>
          <ClosingSection onPlayAgain={handlePlayAgain} assignedPrize={assignedPrize} />
        </div>
      )}

      {/* Stats Section */}
      {currentStep === "stats" && (
        <div ref={statsRef}>
          <StatsSection />
        </div>
      )}

      {/* Debug info - Remove in production */}
      {formData && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg max-w-xs z-50 hidden">
          <p className="font-bold mb-1">Datos registrados:</p>
          <p>{formData.fullName}</p>
          <p>{formData.email}</p>
        </div>
      )}

      {/* Floating Results Viewer - Ocultado */}
      {/* <ResultsViewer /> */}
    </div>
  );
}