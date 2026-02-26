import React from 'react';
import { Play, X, Lock } from 'lucide-react';

export default function Playground({ onClose }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl text-white">
            <Play className="w-3 h-3 fill-current" />
          </div>
          Playground
        </h3>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl border-2 border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 flex flex-col items-center text-center gap-4 group transition-all">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-inner flex items-center justify-center text-4xl mb-2 relative">
             🏓
             <div className="absolute -top-2 -right-2 p-1.5 bg-amber-500 rounded-lg text-white shadow-lg">
                <Lock className="w-4 h-4" />
             </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Pingy Pong</h4>
            <p className="text-purple-600 dark:text-purple-400 font-black tracking-widest text-xs uppercase">
              No disponible.  
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
