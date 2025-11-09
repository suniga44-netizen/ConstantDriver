
import React from 'react';
import { Entry, Earning, Expense, WorkShift } from '../types';
import { TrashIcon } from '../components/Icons';

interface HistoryScreenProps {
    entries: Entry[];
    deleteEntry: (id: string) => void;
}

const EntryItem: React.FC<{ entry: Entry, onDelete: (id: string) => void }> = ({ entry, onDelete }) => {
    const renderDetails = () => {
        switch (entry.type) {
            case 'earning':
                return (
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p className="font-semibold">{entry.category}</p>
                            <p className="text-sm text-gray-400">Ganho</p>
                        </div>
                        <p className="text-lg font-bold text-emerald-400">+ R$ {entry.amount.toFixed(2)}</p>
                    </div>
                );
            case 'expense':
                return (
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p className="font-semibold">{entry.category}</p>
                             <p className="text-sm text-gray-400">{entry.description || 'Despesa'}</p>
                        </div>
                        <p className="text-lg font-bold text-red-400">- R$ {entry.amount.toFixed(2)}</p>
                    </div>
                );
            case 'shift':
                 return (
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p className="font-semibold">Jornada de Trabalho</p>
                            <p className="text-sm text-gray-400">{entry.startTime} - {entry.endTime}</p>
                        </div>
                        <p className="text-lg font-bold text-sky-400">{(entry.durationMinutes / 60).toFixed(1)}h</p>
                    </div>
                );
        }
    };

    return (
        <li className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 group">
            {renderDetails()}
            <button onClick={() => onDelete(entry.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrashIcon className="w-5 h-5" />
            </button>
        </li>
    );
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ entries, deleteEntry }) => {
    // FIX: Correctly type the initial value for the reduce function's accumulator.
    // This resolves an issue where TypeScript infers the accumulator as `{}`,
    // leading to a downstream error where `.map` is called on a value of type `unknown`.
    const groupedEntries = entries.reduce((acc, entry) => {
        const date = new Date(entry.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
    }, {} as Record<string, Entry[]>);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Histórico</h1>
                <p className="text-gray-400">Todos os seus lançamentos.</p>
            </div>
            
            {Object.keys(groupedEntries).length > 0 ? (
                Object.entries(groupedEntries).map(([date, entriesForDate]) => (
                    <div key={date}>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2 sticky top-0 bg-gray-900 py-2">{date}</h2>
                        <ul className="space-y-3">
                            {entriesForDate.map(entry => (
                                <EntryItem key={entry.id} entry={entry} onDelete={deleteEntry} />
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500">Nenhum lançamento encontrado.</p>
                    <p className="text-gray-500 text-sm">Use o botão '+' para adicionar um novo registro.</p>
                </div>
            )}
        </div>
    );
};

export default HistoryScreen;