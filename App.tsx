
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import DashboardScreen from './screens/DashboardScreen';
import HistoryScreen from './screens/HistoryScreen';
import ChartsScreen from './screens/ChartsScreen';
import GoalsScreen from './screens/GoalsScreen';
import InsightsScreen from './screens/InsightsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddEntryModal from './components/AddEntryModal';
import { PlusIcon } from './components/Icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Entry, Goal } from './types';

export type Screen = 'dashboard' | 'history' | 'charts' | 'goals' | 'insights' | 'settings';

const App: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entries, setEntries] = useLocalStorage<Entry[]>('driver-entries', []);
    const [goals, setGoals] = useLocalStorage<Goal[]>('driver-goals', []);

    const addEntry = (entry: Omit<Entry, 'id'>) => {
        const newEntry = { ...entry, id: Date.now().toString() };
        setEntries(prevEntries => [newEntry, ...prevEntries]);
    };

    const deleteEntry = (id: string) => {
        setEntries(entries.filter(entry => entry.id !== id));
    };

    const addGoal = (goal: Omit<Goal, 'id'>) => {
        const newGoal = { ...goal, id: Date.now().toString() };
        setGoals(prevGoals => [...prevGoals, newGoal]);
    };
    
    const deleteGoal = (id: string) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case 'dashboard':
                return <DashboardScreen entries={entries} goals={goals}/>;
            case 'history':
                return <HistoryScreen entries={entries} deleteEntry={deleteEntry} />;
            case 'charts':
                return <ChartsScreen entries={entries} />;
            case 'goals':
                return <GoalsScreen entries={entries} goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} />;
            case 'insights':
                return <InsightsScreen entries={entries} />;
            case 'settings':
                return <SettingsScreen entries={entries} goals={goals} setEntries={setEntries} setGoals={setGoals} />;
            default:
                return <DashboardScreen entries={entries} goals={goals}/>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
            <main className="flex-grow pb-20 p-4">
                {renderScreen()}
            </main>

            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-20 right-4 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-110 z-20"
                aria-label="Adicionar Lançamento"
            >
                <PlusIcon className="w-8 h-8" />
            </button>
            
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

            {isModalOpen && (
                <AddEntryModal
                    onClose={() => setIsModalOpen(false)}
                    onAddEntry={addEntry}
                />
            )}
        </div>
    );
};

export default App;
