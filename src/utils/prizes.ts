/**
 * Utilidades para manejar premios desde Google Sheets
 */

export interface Prize {
  name: string;
  stock: number;
  used: number;
  available: number; // stock - used
}

export interface PrizeSelectionResult {
  prize: string;
  success: boolean;
  message?: string;
}

/**
 * Obtiene premios disponibles desde Google Sheets
 * El sheet debe ser público o tener acceso vía API
 */
export async function fetchPrizesFromSheet(): Promise<Prize[]> {
  // ID del sheet extraído de la URL
  const SHEET_ID = "1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc";
  const RANGE = "A2:C100"; // Columnas A (Premios), B (Stock), C (Usados)
  
  try {
    // Usar la API pública de Google Sheets (requiere que el sheet sea público)
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq=SELECT%20A,B,C%20WHERE%20A%20IS%20NOT%20NULL`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al leer el sheet: ${response.statusText}`);
    }

    const text = await response.text();
    // Google Sheets devuelve el JSON envuelto en una función, necesitamos extraerlo
    const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonText);

    const prizes: Prize[] = [];
    
    if (data.table && data.table.rows) {
      for (const row of data.table.rows) {
        if (row.c && row.c[0] && row.c[0].v) {
          const name = row.c[0].v;
          const stock = parseInt(row.c[1]?.v || "0", 10);
          const used = parseInt(row.c[2]?.v || "0", 10);
          const available = stock - used;

          if (name && stock > 0 && available > 0) {
            prizes.push({ name, stock, used, available });
          }
        }
      }
    }

    return prizes;
  } catch (error) {
    console.error("Error fetching prizes:", error);
    // Retornar premios por defecto si falla
    return [
      { name: "Buzo", stock: 1, used: 0, available: 1 },
      { name: "Remera", stock: 2, used: 0, available: 2 },
      { name: "Gorra", stock: 3, used: 0, available: 3 },
    ];
  }
}

/**
 * Selecciona un premio aleatorio basado en stock disponible
 * Usa probabilidad ponderada (más stock = más probabilidad)
 */
export function selectRandomPrize(prizes: Prize[]): Prize | null {
  if (prizes.length === 0) return null;

  // Calcular total de stock disponible
  const totalAvailable = prizes.reduce((sum, prize) => sum + prize.available, 0);
  
  if (totalAvailable === 0) return null;

  // Selección aleatoria ponderada
  let random = Math.random() * totalAvailable;
  
  for (const prize of prizes) {
    random -= prize.available;
    if (random <= 0) {
      return prize;
    }
  }

  // Fallback: último premio
  return prizes[prizes.length - 1];
}
