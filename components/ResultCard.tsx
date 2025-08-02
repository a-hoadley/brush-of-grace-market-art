
import React from 'react';
import type { EstimationResult } from '../types';
import { TagIcon, PriceTagIcon, CheckCircleIcon, InfoIcon } from './Icons';

interface ResultCardProps {
  result: EstimationResult;
}

const ConfidenceBadge: React.FC<{ confidence: string }> = ({ confidence }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1";
    if (confidence === 'High') {
        return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>High</span>;
    }
    if (confidence === 'Medium') {
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Medium</span>;
    }
    return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>Low</span>;
};


export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-500 ease-out glow-on-hover">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex-shrink-0 flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/50 rounded-xl w-full md:w-auto">
                <p className="text-5xl sm:text-6xl font-bold text-primary-600 dark:text-primary-400">
                    ${result.estimatedPrice}
                </p>
            </div>
            <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{result.itemName}</h2>
                    <ConfidenceBadge confidence={result.confidence} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <PriceTagIcon />
                    <span>Price Range: {result.priceRange}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                     <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <InfoIcon />
                        AI Rationale
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        {result.reasoning}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
