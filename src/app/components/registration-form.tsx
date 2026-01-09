import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { argentinaCities } from "../../data/argentina-cities";
import { validateEmailExists } from "../../utils/email-validation";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  ageRange: string;
  brand: string;
}

interface RegistrationFormProps {
  onComplete: (data: FormData) => Promise<void>;
}

export function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Esperar a que se completen el guardado de datos y la asignación del premio
      await onComplete(data);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      // Aunque haya error, permitir continuar
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValues = watch();
  const progress = Object.values(formValues).filter(Boolean).length / 7;

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black py-12 sm:py-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 sm:mb-3">
            Entrá al juego
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Completá estos datos y empezá a jugar
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 sm:mb-8">
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{ willChange: "width" }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
            {/* Full Name */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-bold text-white mb-2">
                Nombre completo
              </label>
              <input
                {...register("fullName", {
                  required: "Por favor, ingresá tu nombre completo",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                })}
                type="text"
                autoComplete="name"
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-600 bg-slate-800 text-white focus:border-amber-500 focus:outline-none text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation placeholder:text-slate-400"
                placeholder="Juan Pérez"
              />
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.fullName.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-bold text-white mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  {...register("email", {
                    required: "Necesitamos tu email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ingresá un email válido",
                    },
                    validate: async (value) => {
                      // Validar formato primero
                      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                      if (!emailRegex.test(value)) {
                        return "Ingresá un email válido";
                      }

                      // Validar existencia del email (DNS check)
                      setIsValidatingEmail(true);
                      try {
                        const result = await validateEmailExists(value);
                        setIsValidatingEmail(false);
                        if (!result.isValid) {
                          return result.message;
                        }
                        return true;
                      } catch (error) {
                        setIsValidatingEmail(false);
                        // Si hay error, permitir el email para no bloquear
                        return true;
                      }
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  onBlur={async () => {
                    // Validar cuando el usuario sale del campo
                    await trigger("email");
                  }}
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-600 bg-slate-800 text-white focus:border-amber-500 focus:outline-none text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation placeholder:text-slate-400"
                  placeholder="tu@email.com"
                />
                {isValidatingEmail && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1.5 mb-1">
                Verificamos que el dominio exista y pueda recibir emails
              </p>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-bold text-white mb-2">
                Teléfono
              </label>
              <input
                {...register("phone", {
                  required: "Ingresá tu teléfono",
                  pattern: {
                    value: /^[0-9\s\-+()]{8,}$/,
                    message: "Ingresá un teléfono válido",
                  },
                })}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-600 bg-slate-800 text-white focus:border-amber-500 focus:outline-none text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation placeholder:text-slate-400"
                placeholder="+54 11 1234-5678"
              />
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.phone.message}
                </motion.p>
              )}
            </div>

            {/* Postal Code and City */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Código Postal
                </label>
                <input
                  {...register("postalCode", {
                    required: "Requerido",
                    pattern: {
                      value: /^[0-9]{4,}$/,
                      message: "Código inválido",
                    },
                  })}
                  type="text"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  className="w-full px-3 py-4 rounded-xl border-2 border-purple-200 bg-slate-800 text-white focus:border-purple-500 focus:outline-none text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation placeholder:text-slate-400"
                  placeholder="1234"
                />
                {errors.postalCode && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.postalCode.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Ciudad
                </label>
                <input
                  {...register("city", {
                    required: "Requerido",
                    minLength: { value: 2, message: "Muy corto" },
                  })}
                  type="text"
                  autoComplete="address-level2"
                  list="argentina-cities-list"
                  className="w-full px-3 py-4 rounded-xl border-2 border-purple-200 bg-slate-800 text-white focus:border-purple-500 focus:outline-none text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation placeholder:text-slate-400"
                  placeholder="Mar del Plata"
                />
                <datalist id="argentina-cities-list">
                  {argentinaCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                {errors.city && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.city.message}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Age Range */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-bold text-white mb-2">
                Rango de edad
              </label>
              <select
                {...register("ageRange", { required: "Seleccioná tu edad" })}
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-600 bg-slate-800 text-white focus:border-amber-500 focus:outline-none text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation"
              >
                <option value="">Seleccioná...</option>
                <option value="18-24">18-24 años</option>
                <option value="25-34">25-34 años</option>
                <option value="35-44">35-44 años</option>
                <option value="45-54">45-54 años</option>
                <option value="55+">55+ años</option>
              </select>
              {errors.ageRange && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.ageRange.message}
                </motion.p>
              )}
            </div>

            {/* Brand */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-bold text-white mb-2">
                ¿Qué marca consumís habitualmente?
              </label>
              <select
                {...register("brand", { required: "Seleccioná una marca" })}
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-600 bg-slate-800 text-white focus:border-amber-500 focus:outline-none text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation"
              >
                <option value="">Seleccioná...</option>
                <option value="marlboro-red">MARLBORO RED</option>
                <option value="marlboro-gold">MARLBORO GOLD</option>
                <option value="marlboro-vista">MARLBORO VISTA</option>
                <option value="philip-morris">PHILIP MORRIS</option>
                <option value="philip-morris-caps">PHILIP MORRIS CAPS</option>
                <option value="marlboro-crafted">MARLBORO CRAFTED</option>
                <option value="lucky-strike">LUCKY STRIKE</option>
                <option value="lucky-strike-convertible">LUCKY STRIKE CONVERTIBLE</option>
                <option value="lucky-strike-origen">LUCKY STRIKE ORIGEN</option>
                <option value="camel">CAMEL</option>
                <option value="milenio">MILENIO</option>
                <option value="red-point">RED POINT</option>
                <option value="dolchester">DOLCHESTER</option>
                <option value="otros-cigarillos">OTROS CIGARRILLOS</option>
                <option value="van-kiff">VAN KIFF</option>
                <option value="van-haasen">VAN HAASEN</option>
                <option value="flandria">FLANDRIA</option>
                <option value="argento">ARGENTO</option>
                <option value="sayris">SAYRIS</option>
                <option value="drum">DRUM</option>
                <option value="red-field">RED FIELD</option>
                <option value="pachamama">PACHAMAMA</option>
                <option value="pueblo">PUEBLO</option>
                <option value="cerrito">CERRITO</option>
                <option value="stanley">STANLEY</option>
                <option value="otros-tabacos-armar">OTROS TABACOS P/ARMAR</option>
              </select>
              {errors.brand && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.brand.message}
                </motion.p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isValid || isSubmitting}
            whileHover={isValid ? { scale: 1.01 } : {}}
            whileTap={isValid ? { scale: 0.99 } : {}}
            className={`w-full py-6 rounded-2xl text-lg sm:text-xl font-black transition-all min-h-[56px] touch-manipulation ${
              isValid && !isSubmitting
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 active:shadow-lg hover:from-amber-600 hover:to-amber-700"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Procesando...
              </span>
            ) : (
              "Continuar al juego"
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}