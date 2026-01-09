import { motion } from "motion/react";
import { Send, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function WebhookTester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testWebhook = async () => {
    try {
      setLoading(true);
      setResult(null);

      const testData = {
        lastPlayedAt: Date.now(),
        correctUids: { "1": true, "2": true, "3": true },
        timePassed: 45,
        playerInput: null,
        progress: 1,
        playerUid: `test-${Math.random().toString(36).substring(7)}`,
        activityKey: "test-activity",
      };

      console.log("🧪 Testing webhook with data:", testData);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(testData),
        }
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Success response:", data);

      setResult({
        success: true,
        message: `¡Webhook funcionando! Resultado guardado con key: ${data.key}`,
      });
    } catch (err) {
      console.error("❌ Error testing webhook:", err);
      setResult({
        success: false,
        message: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
        🧪 Probar Webhook
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Este botón envía un resultado de prueba al webhook para verificar que funciona correctamente.
      </p>

      <button
        onClick={testWebhook}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Probando...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Enviar Prueba
          </>
        )}
      </button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border-2 ${
            result.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-2">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm font-medium flex-1 ${
                result.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.message}
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>URL:</strong>{" "}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
            /webhook/game-results
          </code>
        </p>
      </div>
    </div>
  );
}
