
import React, { useState } from 'react';
import { Entry } from '../types';
import { getInsights } from '../services/geminiService';
import { SparklesIcon } from '../components/Icons';

interface InsightsScreenProps {
    entries: Entry[];
}

const InsightsScreen: React.FC<InsightsScreenProps> = ({ entries }) => {
    const [insights, setInsights] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setError(null);
        setInsights(null);
        try {
            const result = await getInsights(entries);
            setInsights(result);
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Insights</h1>
                <p className="text-gray-400">Análise inteligente do seu desempenho com IA.</p>
            </div>

            <div className="text-center">
                <button
                    onClick={handleGenerateInsights}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Gerando...
                        </>
                    ) : (
                       <>
                        <SparklesIcon className="w-5 h-5" />
                        Gerar Insights
                       </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Erro: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {insights && (
                <div className="bg-gray-800 p-4 rounded-lg animate-fade-in">
                    <h2 className="text-xl font-semibold text-white mb-3">Sua Análise Personalizada</h2>
                    <div className="prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 whitespace-pre-wrap">
                        {insights}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsightsScreen;
