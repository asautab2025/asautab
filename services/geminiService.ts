
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from '../types';

export const extractDataFromImage = async (base64Image: string): Promise<ExtractedData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analiza esta notificación de multa de tráfico o expediente sancionador.
            Extrae la siguiente información en formato JSON. Si un campo no aparece, déjalo vacío o null.
            
            - organo: Organismo que emite la multa (ej. Jefatura Provincial de Tráfico, Ayuntamiento de...).
            - expediente: Número de expediente o referencia de la multa.
            - infringement: Artículo o norma infringida mencionada (Infracción de...).
            - fact: Descripción del hecho denunciado (Consistente en...).
            - notificationDate: Fecha de la notificación si aparece.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            organo: { type: Type.STRING, nullable: true },
            expediente: { type: Type.STRING, nullable: true },
            infringement: { type: Type.STRING, nullable: true },
            fact: { type: Type.STRING, nullable: true },
            notificationDate: { type: Type.STRING, nullable: true },
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ExtractedData;
    }
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini extraction error:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
