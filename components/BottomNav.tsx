
import React from 'react';
import { Screen } from '../App';
import { HomeIcon, HistoryIcon, ChartIcon, TargetIcon, SparklesIcon, SettingsIcon } from './Icons';

interface BottomNavProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const activeClass = isActive ? 'text-emerald-400' : 'text-gray-400';
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ease-in-out hover:text-emerald-300 ${activeClass}`}
        >
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
    const navItems = [
        { id: 'dashboard', label: 'Início', icon: <HomeIcon className="w-6 h-6" /> },
        { id: 'history', label: 'Histórico', icon: <HistoryIcon className="w-6 h-6" /> },
        { id: 'charts', label: 'Gráficos', icon: <ChartIcon className="w-6 h-6" /> },
        { id: 'goals', label: 'Metas', icon: <TargetIcon className="w-6 h-6" /> },
        { id: 'insights', label: 'Insights', icon: <SparklesIcon className="w-6 h-6" /> },
        { id: 'settings', label: 'Ajustes', icon: <SettingsIcon className="w-6 h-6" /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-10">
            <div className="flex justify-around max-w-screen-sm mx-auto">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeScreen === item.id}
                        onClick={() => setActiveScreen(item.id as Screen)}
                    />
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
