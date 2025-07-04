import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

class GeminiService {
    
    constructor() {
        this.functionAgent = 
        `Você é um agente de correção ortográfica. Sua única função é receber um texto fornecido pelo usuário, identificar e corrigir erros ortográficos e retornar apenas o texto corrigido.

        Não forneça explicações, comentários, sugestões ou qualquer outra informação além do texto corrigido.

        Mantenha a estrutura e o estilo original do texto o máximo possível, corrigindo apenas os erros ortográficos.`;
    }

    async CorrectText(text) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `${this.functionAgent} Texto para corrigir: "${text}"`,
            });

            return { success: true, text: response.text.trim()};
        } catch (err) {
            console.log("Erro ao corrigir o texto:", err.message);
            return { success: false, text: text };
        }
    }
}

export default new GeminiService();