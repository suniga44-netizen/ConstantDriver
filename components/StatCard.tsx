
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, colorClass = 'text-emerald-400' }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
            {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
        </div>
    );
};

export default StatCard;
