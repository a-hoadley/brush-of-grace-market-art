
import React, { useState, useCallback } from 'react';
import { getMarketValueEstimation } from './services/geminiService';
import type { EstimationResult } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { Spinner } from './components/Spinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BrandIcon, ErrorIcon } from './components/Icons';

const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [zipCode, setZipCode] = useState<string>('');
    const [estimation, setEstimation] = useState<EstimationResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleImageChange = (file: File) => {
        setImageFile(file);
        setEstimation(null);
        setError(null);
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(URL.createObjectURL(file));
    };

    const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZipCode(e.target.value);
        setEstimation(null);
        setError(null);
    };

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!imageFile || !zipCode.match(/^\d{5}$/)) {
            setError('Please provide a valid image and a 5-digit zip code.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEstimation(null);

        try {
            const result = await getMarketValueEstimation(imageFile, zipCode);
            setEstimation(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, zipCode]);

    const isFormValid = imageFile && zipCode.match(/^\d{5}$/);

    return (
        <ErrorBoundary>
            <div className="min-h-screen text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <BrandIcon />
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                            Local Market Estimator
                        </h1>
                    </div>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                        Upload an image and enter a zip code to get an AI-powered price estimate.
                    </p>
                </header>

                <main>
                    <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 glow-on-hover">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <ImageUploader onImageSelect={handleImageChange} imageUrl={imageUrl} />

                            <div>
                                <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Local Zip Code
                                </label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    value={zipCode}
                                    onChange={handleZipCodeChange}
                                    placeholder="e.g., 90210"
                                    maxLength={5}
                                    className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className="w-full flex justify-center items-center gap-2 px-6 py-4 text-base font-semibold text-white bg-primary-600 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner />
                                        <span>Estimating...</span>
                                    </>
                                ) : (
                                    'Get Estimate'
                                )}
                            </button>
                        </form>
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-3">
                            <ErrorIcon />
                            <p>{error}</p>
                        </div>
                    )}

                    {isLoading && !estimation && (
                         <div className="mt-6 glass-card p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
                            </div>
                        </div>
                    )}
                    
                    {estimation && !isLoading && (
                        <div className="mt-6">
                            <ResultCard result={estimation} />
                        </div>
                    )}

                </main>
            </div>
        </div>
        </ErrorBoundary>
    );
};

export default App;
