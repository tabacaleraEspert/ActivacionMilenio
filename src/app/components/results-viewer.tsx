import { motion, AnimatePresence } from "motion/react";
import { Database, X, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function ResultsViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ecc7502f/game-results`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 Game results fetched:", data);

      if (data.success && data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("❌ Error fetching game results:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchResults();
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
        title="Ver resultados guardados"
      >
        <Database className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6" />
                  <div>
                    <h3 className="text-2xl font-black">Resultados Guardados</h3>
                    <p className="text-sm text-white/80">
                      Base de datos Supabase
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchResults}
                    disabled={loading}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
                    title="Actualizar"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    title="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Cargando resultados...</p>
                  </div>
                )}

                {error && !loading && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-800 font-bold mb-2">⚠️ Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                      onClick={fetchResults}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Reintentar
                    </button>
                  </div>
                )}

                {!loading && !error && results.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl font-bold text-gray-400 mb-2">
                      No hay resultados guardados
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Configurá el webhook en puzzel.org para empezar a guardar resultados
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto text-left">
                      <p className="font-bold text-blue-900 mb-2 text-sm">📝 URL del Webhook:</p>
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded block overflow-x-auto">
                        https://{projectId}.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results
                      </code>
                    </div>
                  </div>
                )}

                {!loading && !error && results.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-black text-purple-900">
                            {results.length}
                          </p>
                          <p className="text-sm text-purple-600 font-medium">
                            Resultados totales
                          </p>
                        </div>
                        <Database className="w-12 h-12 text-purple-400" />
                      </div>
                    </div>

                    {results.map((result, index) => (
                      <motion.div
                        key={result.key || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                                {index + 1}
                              </span>
                              <p className="text-xs text-gray-500 truncate">
                                {new Date(result.lastPlayedAt).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                              ID: {result.playerUid}
                            </p>
                            {result.key && (
                              <p className="text-xs text-gray-400 truncate mt-1">
                                Key: {result.key}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-center">
                              <p className="text-xl font-black text-purple-900">
                                {Math.round(result.progress * 100)}%
                              </p>
                              <p className="text-xs text-purple-600">Progreso</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-black text-blue-900">
                                {Math.round(result.timePassed)}s
                              </p>
                              <p className="text-xs text-blue-600">Tiempo</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Última actualización: {new Date().toLocaleTimeString()}
                  </span>
                  <span className="font-mono">
                    KV Store
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
