
import React, { useState, useCallback } from 'react';
import PackageFinderForm from './components/PackageFinderForm';
import PackageResultCard from './components/PackageResultCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import InfoModal from './components/InfoModal';
import { findSimilarPackages, findSimilarPackagesWithUserKey } from './services/geminiService';
import { PackageSuggestion, FormField } from './types';
import { DEFAULT_SOURCE_LANGUAGE, DEFAULT_TARGET_LANGUAGE } from './constants';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    sourcePackage: '',
    sourceLanguage: DEFAULT_SOURCE_LANGUAGE,
    targetLanguage: DEFAULT_TARGET_LANGUAGE,
     userApiKey: '',
  });
  const [results, setResults] = useState<PackageSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleInputChange = useCallback((field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    // API Key check removed from frontend. Backend handles API key configuration.
    // If process.env.API_KEY was critical for some other frontend logic (it wasn't here),
    // that would need reassessment.

    try {
      const { sourcePackage, sourceLanguage, targetLanguage, userApiKey } = formData;
      if (sourcePackage.trim() === '') {
        setError("Package name cannot be empty.");
        setIsLoading(false);
        return;
      }
      if (sourceLanguage === targetLanguage) {
        setError("Source and Target languages cannot be the same. Please select different languages.");
        setIsLoading(false);
        return;
      }
      // const suggestions = await findSimilarPackages(sourcePackage, sourceLanguage, targetLanguage);
       let suggestions: PackageSuggestion[];
      if (userApiKey.trim()) {
        suggestions = await findSimilarPackagesWithUserKey(sourcePackage, sourceLanguage, targetLanguage, userApiKey);
      } else {
        suggestions = await findSimilarPackages(sourcePackage, sourceLanguage, targetLanguage);
      }
      setResults(suggestions);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <header className="text-center mb-10">
        <span className="text-5xl font-extrabold mr-2">
         📦 
        </span>
        <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-2">
         Package Pal
        </span>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Discover equivalent or similar software packages across different programming languages with the power of AI.
        </p>
      </header>

      <main className="w-full max-w-2xl">
        <PackageFinderForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!isLoading && !error && hasSearched && results.length === 0 && (
          <div className="mt-8 text-center bg-slate-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold text-sky-400 mb-2">No Suggestions Found</h3>
            <p className="text-slate-300">
              We couldn't find any similar packages for your query. Try refining your search terms or check the languages selected.
            </p>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-center mb-8 text-sky-300">
              Suggested Packages
            </h2>
            <div className="space-y-6">
              {results.map((pkg, index) => (
                <PackageResultCard key={`${pkg.name}-${index}`} packageInfo={pkg} index={index} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-slate-500">
          <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex mb-10 items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            aria-label="Show application information"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>App Info</span>
          </button>
          </div>
        <p>&copy; {new Date().getFullYear()} Package Pal. Powered by Gemini (via Backend).</p>
        <p className="mt-4">Made with ❤️ in India by <a href="mailto:sagarkashyap.cc@gmail.com" className="text-sky-400 hover:underline">Sagar Kashyap</a></p>
      </footer>
            {isModalOpen && <InfoModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default App;