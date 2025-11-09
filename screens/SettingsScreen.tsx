
import React, { useRef } from 'react';
import { Entry, Goal } from '../types.ts';

interface SettingsScreenProps {
    entries: Entry[];
    goals: Goal[];
    setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ entries, goals, setEntries, setGoals }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = JSON.stringify({ entries, goals }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `drivers_dash_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const data = JSON.parse(text);
                        if (Array.isArray(data.entries) && Array.isArray(data.goals)) {
                           if (confirm('Isso substituirá todos os seus dados atuais. Deseja continuar?')) {
                             setEntries(data.entries);
                             setGoals(data.goals);
                             alert('Dados importados com sucesso!');
                           }
                        } else {
                            throw new Error('Formato de arquivo inválido.');
                        }
                    }
                } catch (error) {
                    alert('Erro ao importar o arquivo. Verifique se o arquivo é um backup válido.');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleClearData = () => {
        if (confirm('TEM CERTEZA? Todos os seus dados serão apagados permanentemente. Esta ação não pode ser desfeita.')) {
            setEntries([]);
            setGoals([]);
            alert('Todos os dados foram apagados.');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Ajustes</h1>
                <p className="text-gray-400">Gerencie os dados do seu aplicativo.</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Gerenciamento de Dados</h2>
                <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                    <button onClick={handleExport} className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg">Exportar Dados</button>
                    <button onClick={handleImportClick} className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg">Importar Dados</button>
                    <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>
            </div>

             <div className="space-y-4">
                <h2 className="text-xl font-semibold text-red-400">Zona de Perigo</h2>
                <div className="bg-gray-800 border border-red-500/50 p-4 rounded-lg space-y-3">
                    <p className="text-sm text-gray-400">
                        Esta ação é irreversível. Faça um backup dos seus dados antes de continuar.
                    </p>
                    <button onClick={handleClearData} className="w-full text-left bg-red-800 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg">Apagar Todos os Dados</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;