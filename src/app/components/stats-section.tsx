import { motion } from "motion/react";
import { Trophy, Clock, Target, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface GameResultSummary {
  key: string;
  playerUid: string;
  lastPlayedAt: number;
  progress: number;
  timePassed: number;
}

export function StatsSection() {
  const [results, setResults] = useState<GameResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

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
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Game results fetched:", data);

      if (data.success && data.results) {
        // Sort by lastPlayedAt, most recent first
        const sortedResults = data.results.sort(
          (a: GameResultSummary, b: GameResultSummary) => b.lastPlayedAt - a.lastPlayedAt
        );
        setResults(sortedResults);
      }
    } catch (err) {
      console.error("❌ Error fetching game results:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (results.length === 0) return null;

    const totalGames = results.length;
    const completedGames = results.filter((r) => r.progress === 1).length;
    const avgTime = results.reduce((acc, r) => acc + r.timePassed, 0) / totalGames;
    const bestTime = Math.min(...results.map((r) => r.timePassed));

    return {
      totalGames,
      completedGames,
      avgTime: Math.round(avgTime),
      bestTime: Math.round(bestTime),
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white font-bold text-xl">Cargando estadísticas...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 py-12 px-4 sm:px-6 flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-4"
          >
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300 drop-shadow-lg" strokeWidth={2} />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
            Estadísticas Generales
          </h2>
          <p className="text-base sm:text-xl text-white/90 drop-shadow-md">
            Mirá cómo lo están haciendo todos los jugadores
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-100 border-2 border-red-400 rounded-2xl p-6 mb-8 text-center"
          >
            <p className="text-red-800 font-bold">⚠️ {error}</p>
          </motion.div>
        )}

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Total Games */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-2xl text-center"
              >
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-black text-blue-900 mb-1">
                  {stats.totalGames}
                </p>
                <p className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wide">
                  Partidas
                </p>
              </motion.div>

              {/* Completed Games */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-2xl text-center"
              >
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-black text-green-900 mb-1">
                  {stats.completedGames}
                </p>
                <p className="text-xs sm:text-sm font-bold text-green-600 uppercase tracking-wide">
                  Completadas
                </p>
              </motion.div>

              {/* Average Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-2xl text-center"
              >
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-black text-purple-900 mb-1">
                  {stats.avgTime}s
                </p>
                <p className="text-xs sm:text-sm font-bold text-purple-600 uppercase tracking-wide">
                  Tiempo Prom.
                </p>
              </motion.div>

              {/* Best Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-2xl text-center"
              >
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-black text-orange-900 mb-1">
                  {stats.bestTime}s
                </p>
                <p className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-wide">
                  Mejor Tiempo
                </p>
              </motion.div>
            </div>

            {/* Recent Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center">
                Últimos Resultados
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.slice(0, 10).map((result, index) => (
                  <motion.div
                    key={result.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 truncate">
                          {new Date(result.lastPlayedAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          ID: {result.playerUid.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-900">
                          {Math.round(result.progress * 100)}%
                        </p>
                        <p className="text-xs text-purple-600">Progreso</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-orange-900">
                          {Math.round(result.timePassed)}s
                        </p>
                        <p className="text-xs text-orange-600">Tiempo</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={fetchResults}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  🔄 Actualizar
                </button>
              </div>
            </motion.div>
          </>
        )}

        {!stats && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center shadow-2xl"
          >
            <p className="text-2xl font-bold text-gray-400 mb-2">📊</p>
            <p className="text-xl font-bold text-gray-600">
              Todavía no hay resultados guardados
            </p>
            <p className="text-gray-500 mt-2">
              ¡Jugá una partida para ver las estadísticas!
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
