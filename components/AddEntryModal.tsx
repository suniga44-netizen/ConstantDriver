import React, { useState } from 'react';
import { EarningCategory, ExpenseCategory, Entry } from '../types';
import { XIcon } from './Icons';

interface AddEntryModalProps {
    onClose: () => void;
    onAddEntry: (entry: Omit<Entry, 'id'>) => void;
}

type EntryType = 'earning' | 'expense' | 'shift';

const AddEntryModal: React.FC<AddEntryModalProps> = ({ onClose, onAddEntry }) => {
    const [entryType, setEntryType] = useState<EntryType>('earning');
    const [amount, setAmount] = useState('');
    const [earningCategory, setEarningCategory] = useState<EarningCategory>(EarningCategory.UBER);
    const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>(ExpenseCategory.FUEL);
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        switch (entryType) {
            case 'earning':
                onAddEntry({
                    type: 'earning',
                    date: today,
                    category: earningCategory,
                    amount: parseFloat(amount),
                });
                break;
            case 'expense':
                onAddEntry({
                    type: 'expense',
                    date: today,
                    category: expenseCategory,
                    amount: parseFloat(amount),
                    description,
                });
                break;
            case 'shift':
                const start = new Date(`${today}T${startTime}`);
                const end = new Date(`${today}T${endTime}`);
                let durationMinutes = (end.getTime() - start.getTime()) / 60000;
                if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight shifts
                onAddEntry({
                    type: 'shift',
                    date: today,
                    startTime,
                    endTime,
                    durationMinutes,
                });
                break;
        }
        onClose();
    };

    const renderForm = () => {
        switch (entryType) {
            case 'earning':
            case 'expense':
                return (
                    <>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Valor (R$)</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-400">Categoria</label>
                            <select
                                id="category"
                                value={entryType === 'earning' ? earningCategory : expenseCategory}
                                onChange={(e) => entryType === 'earning' ? setEarningCategory(e.target.value as EarningCategory) : setExpenseCategory(e.target.value as ExpenseCategory)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {Object.values(entryType === 'earning' ? EarningCategory : ExpenseCategory).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        {entryType === 'expense' && (
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-400">Descrição (Opcional)</label>
                                <input
                                    type="text"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Ex: Troca de óleo"
                                />
                            </div>
                        )}
                    </>
                );
            case 'shift':
                 return (
                    <>
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-400">Início da Jornada</label>
                            <input
                                type="time"
                                id="startTime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-400">Fim da Jornada</label>
                            <input
                                type="time"
                                id="endTime"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                    </>
                 );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800">
                    <h2 className="text-xl font-bold">Adicionar Lançamento</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex border-b border-gray-700 mb-4">
                        <button onClick={() => setEntryType('earning')} className={`flex-1 py-2 text-sm font-medium ${entryType === 'earning' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}>Ganho</button>
                        <button onClick={() => setEntryType('expense')} className={`flex-1 py-2 text-sm font-medium ${entryType === 'expense' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}>Gasto</button>
                        <button onClick={() => setEntryType('shift')} className={`flex-1 py-2 text-sm font-medium ${entryType === 'shift' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}>Jornada</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {renderForm()}
                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-500">Cancelar</button>
                            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-500">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEntryModal;