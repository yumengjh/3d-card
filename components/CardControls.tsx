import React from 'react';

interface CardControlsProps {
  isHolographic: boolean;
  onToggleHolo: () => void;
}

export const CardControls: React.FC<CardControlsProps> = ({ isHolographic, onToggleHolo }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button 
        onClick={onToggleHolo}
        className={`
           px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase transition-all flex items-center gap-2 border
           ${isHolographic 
             ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent text-white shadow-lg shadow-purple-500/25' 
             : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
            }
        `}
      >
        <svg className={`w-4 h-4 ${isHolographic ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        {isHolographic ? 'Holographic ON' : 'Holographic OFF'}
      </button>
    </div>
  );
};