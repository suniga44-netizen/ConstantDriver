import React from 'react';
import StatCard from '../components/StatCard.tsx';
import { Entry, Goal, GoalPeriod } from '../types.ts';

interface DashboardScreenProps {
    entries: Entry[];
    goals: Goal[];
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ entries, goals }) => {
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfWeekDateString = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;

    const todayEntries = entries.filter(e => e.date === todayDateString);
    const weekEntries = entries.filter(e => e.date >= startOfWeekDateString && e.date <= todayDateString);

    const calculateMetrics = (entryList: Entry[]) => {
        let totalEarnings = 0;
        let totalExpenses = 0;
        let totalHours = 0;

        entryList.forEach(entry => {
            if (entry.type === 'earning') totalEarnings += entry.amount;
            if (entry.type === 'expense') totalExpenses += entry.amount;
            if (entry.type === 'shift') totalHours += entry.durationMinutes / 60;
        });

        const netProfit = totalEarnings - totalExpenses;
        const avgPerHour = totalHours > 0 ? netProfit / totalHours : 0;

        return { totalEarnings, totalExpenses, netProfit, totalHours, avgPerHour };
    };

    const todayMetrics = calculateMetrics(todayEntries);
    const weekMetrics = calculateMetrics(weekEntries);

    const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;
    const formatHours = (value: number) => `${value.toFixed(1)}h`;

    const getGoalProgress = (goal: Goal) => {
        const relevantEntries = goal.period === GoalPeriod.DAILY ? todayEntries : weekEntries;
        const metrics = calculateMetrics(relevantEntries);
        
        let current = 0;
        if (goal.type === 'earning') current = metrics.totalEarnings;
        if (goal.type === 'hours') current = metrics.totalHours;
        
        const progress = goal.target > 0 ? (current / goal.target) * 100 : 0;
        return { current, progress: Math.min(progress, 100) };
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Resumo do seu desempenho.</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Hoje</h2>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Lucro Líquido" value={formatCurrency(todayMetrics.netProfit)} colorClass={todayMetrics.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}/>
                    <StatCard title="Ganhos" value={formatCurrency(todayMetrics.totalEarnings)} />
                    <StatCard title="Horas" value={formatHours(todayMetrics.totalHours)} />
                    <StatCard title="Média R$/h" value={formatCurrency(todayMetrics.avgPerHour)} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Esta Semana</h2>
                <div className="grid grid-cols-2 gap-4">
                     <StatCard title="Lucro Líquido" value={formatCurrency(weekMetrics.netProfit)} colorClass={weekMetrics.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}/>
                    <StatCard title="Ganhos" value={formatCurrency(weekMetrics.totalEarnings)} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Progresso das Metas</h2>
                <div className="space-y-3">
                    {goals.length > 0 ? goals.map(goal => {
                        const { current, progress } = getGoalProgress(goal);
                        const isEarning = goal.type === 'earning';
                        return (
                             <div key={goal.id} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-sm font-medium text-gray-300">{goal.description}</span>
                                    <span className="text-xs text-gray-400">{isEarning ? formatCurrency(current) : formatHours(current)} / {isEarning ? formatCurrency(goal.target) : formatHours(goal.target)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )
                    }) : <p className="text-gray-500 text-center py-4">Nenhuma meta definida. Vá para a tela de Metas para criar uma!</p>}
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;