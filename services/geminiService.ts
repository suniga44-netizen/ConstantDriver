
import { GoogleGenAI } from "@google/genai";
import { Entry } from "../types.ts";

export const getInsights = async (entries: Entry[]): Promise<string> => {
  if (entries.length < 5) {
      return "Dados insuficientes para gerar insights. Adicione pelo menos 5 lançamentos (ganhos e despesas) para uma análise mais precisa.";
  }

  // FIX: Initialize GoogleGenAI with API key from environment variables directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const formattedData = entries
    .slice(0, 100) // Use a recent subset of data to avoid overly large prompts
    .map(entry => {
        if (entry.type === 'earning') {
            return `Ganho: ${entry.date}, Categoria: ${entry.category}, Valor: R$${entry.amount.toFixed(2)}`;
        }
        if (entry.type === 'expense') {
            return `Despesa: ${entry.date}, Categoria: ${entry.category}, Valor: R$${entry.amount.toFixed(2)}, Desc: ${entry.description || 'N/A'}`;
        }
        if (entry.type === 'shift') {
            return `Jornada: ${entry.date}, Duração: ${entry.durationMinutes} minutos`;
        }
        return '';
    }).join('\n');

  // FIX: Use systemInstruction for persona and instructions, and contents for user data and query.
  const systemInstruction = `Você é um consultor financeiro especialista para motoristas de aplicativo.
    Analise os seguintes dados de um motorista e forneça insights e dicas práticas para otimizar os ganhos e reduzir despesas.
    Seja conciso, use tópicos (bullet points) e foque em conselhos acionáveis.
    A resposta deve ser em português do Brasil.`;

  const userPrompt = `
    Dados do Motorista:
    ${formattedData}
    
    Baseado nesses dados, forneça:
    1. Uma breve análise geral do desempenho financeiro.
    2. Identificação das maiores fontes de ganho e despesa.
    3. Dicas para aumentar a lucratividade (melhores horários, estratégias, etc.).
    4. Sugestões para reduzir os custos principais (combustível, manutenção, etc.).
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    return "Ocorreu um erro ao tentar gerar os insights. Por favor, tente novamente mais tarde.";
  }
};