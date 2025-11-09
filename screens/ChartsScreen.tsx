
import React from 'react';
import { Entry, ExpenseCategory } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartsScreenProps {
    entries: Entry[];
}

const ChartsScreen: React.FC<ChartsScreenProps> = ({ entries }) => {
    // Aggregate data for the last 7 days
    const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayEntries = entries.filter(e => e.date === dateStr);
        
        const earnings = dayEntries.filter(e => e.type === 'earning').reduce((sum, e) => sum + e.amount, 0);
        const expenses = dayEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
        
        return {
            name: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
            Ganhos: earnings,
            Gastos: expenses,
        };
    }).reverse();

    // Aggregate data for expense categories
    const expenseData = entries
        .filter(e => e.type === 'expense')
        .reduce((acc, entry) => {
            if (entry.type === 'expense') {
                const category = entry.category;
                acc[category] = (acc[category] || 0) + entry.amount;
            }
            return acc;
        }, {} as Record<ExpenseCategory, number>);

    const pieData = Object.entries(expenseData).map(([name, value]) => ({ name, value }));

    const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Gráficos</h1>
                <p className="text-gray-400">Visualize seu desempenho financeiro.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-4">Ganhos vs Gastos (Últimos 7 Dias)</h2>
                {entries.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={last7DaysData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} cursor={{fill: '#4B556380'}}/>
                            <Legend />
                            <Bar dataKey="Ganhos" fill="#10B981" />
                            <Bar dataKey="Gastos" fill="#EF4444" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <p className="text-gray-500 text-center py-10">Dados insuficientes para exibir o gráfico.</p>}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-4">Distribuição de Gastos</h2>
                 {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} />
                        </PieChart>
                    </ResponsiveContainer>
                 ) : <p className="text-gray-500 text-center py-10">Nenhum gasto registrado para exibir o gráfico.</p>}
            </div>
        </div>
    );
};

export default ChartsScreen;