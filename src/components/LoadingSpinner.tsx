// src/components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps { message?: string; isDark?: boolean; }
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading...", isDark = true }) => {
    const textColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const borderColor = isDark ? 'border-blue-300' : 'border-blue-500';
    return ( <div className="flex flex-col items-center justify-center space-y-2">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${borderColor}`}></div>
        <p className={textColor}>{message}</p>
    </div> );
};

export default LoadingSpinner;