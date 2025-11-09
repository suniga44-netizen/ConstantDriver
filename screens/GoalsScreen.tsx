
import React, { useState } from 'react';
import { Entry, Goal, GoalType, GoalPeriod } from '../types.ts';
import { TrashIcon } from '../components/Icons.tsx';

interface GoalsScreenProps {
    entries: Entry[];
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id'>) => void;
    deleteGoal: (id: string) => void;
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ entries, goals, addGoal, deleteGoal }) => {
    const [description, setDescription] = useState('');
    const [target, setTarget] = useState('');
    const [type, setType] = useState<GoalType>(GoalType.EARNING);
    const [period, setPeriod] = useState<GoalPeriod>(GoalPeriod.WEEKLY);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !target) return;
        addGoal({ description, target: parseFloat(target), type, period });
        setDescription('');
        setTarget('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Metas</h1>
                <p className="text-gray-400">Defina e acompanhe seus objetivos.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-4">Nova Meta</h2>
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição (ex: Ganhos da semana)"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="Alvo (R$ ou horas)"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                            required
                        />
                        <select value={type} onChange={e => setType(e.target.value as GoalType)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                            <option value={GoalType.EARNING}>Ganhos</option>
                            <option value={GoalType.HOURS}>Horas</option>
                        </select>
                    </div>
                    <select value={period} onChange={e => setPeriod(e.target.value as GoalPeriod)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                        <option value={GoalPeriod.DAILY}>Diária</option>
                        <option value={GoalPeriod.WEEKLY}>Semanal</option>
                        <option value={GoalPeriod.MONTHLY}>Mensal</option>
                    </select>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-500">Adicionar Meta</button>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Metas Ativas</h2>
                {goals.length > 0 ? (
                    <ul className="space-y-3">
                        {goals.map(goal => (
                            <li key={goal.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center group">
                                <div>
                                    <p className="font-semibold">{goal.description}</p>
                                    <p className="text-sm text-gray-400">
                                        Alvo: {goal.type === 'earning' ? `R$ ${goal.target}` : `${goal.target}h`} ({goal.period})
                                    </p>
                                </div>
                                <button onClick={() => deleteGoal(goal.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500 text-center py-8">Nenhuma meta ativa.</p>}
            </div>
        </div>
    );
};

export default GoalsScreen;