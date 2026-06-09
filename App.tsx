import React, { useState, useCallback, useEffect } from 'react';
import PackageFinderForm from './components/PackageFinderForm';
import PackageResultCard from './components/PackageResultCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import InfoModal from './components/InfoModal';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
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

  // Dynamic Routing state mapping url path
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact' | 'privacy'>(() => {
    const path = window.location.pathname;
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    if (path === '/privacy') return 'privacy';
    return 'home';
  });

  const navigateTo = useCallback((page: 'home' | 'about' | 'contact' | 'privacy') => {
    setCurrentPage(page);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', path);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/about') setCurrentPage('about');
      else if (path === '/contact') setCurrentPage('contact');
      else if (path === '/privacy') setCurrentPage('privacy');
      else setCurrentPage('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleInputChange = useCallback((field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

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
      {/* Navigation bar */}
      <nav className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center py-4 px-6 mb-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/40 rounded-xl shadow-lg gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
          <span className="text-2xl">📦</span>
          <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">Package Pal</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex gap-4 sm:gap-6 text-sm font-medium text-slate-300">
            <button onClick={() => navigateTo('home')} className={`hover:text-sky-400 transition-colors ${currentPage === 'home' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : 'pb-1'}`}>Home</button>
            <button onClick={() => navigateTo('about')} className={`hover:text-sky-400 transition-colors ${currentPage === 'about' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : 'pb-1'}`}>About</button>
            <button onClick={() => navigateTo('contact')} className={`hover:text-sky-400 transition-colors ${currentPage === 'contact' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : 'pb-1'}`}>Contact</button>
            <button onClick={() => navigateTo('privacy')} className={`hover:text-sky-400 transition-colors ${currentPage === 'privacy' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1' : 'pb-1'}`}>Privacy Policy</button>
          </div>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=SagarKashyap.package-pal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-200"
          >
            <span>Get Extension</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Main views rendering */}
      {currentPage === 'home' && (
        <>
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
            <div className="mt-5 flex justify-center">
              <a
                href="https://marketplace.visualstudio.com/items?itemName=SagarKashyap.package-pal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-sky-400 hover:text-sky-300 text-xs font-semibold py-1.5 px-4 rounded-full shadow-lg transition-all duration-200"
              >
                <span>🔌 Also available as a VS Code & Browser Extension</span>
                <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full text-[10px]">Install</span>
              </a>
            </div>
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
        </>
      )}

      {currentPage === 'about' && <AboutUs />}
      {currentPage === 'contact' && <ContactUs />}
      {currentPage === 'privacy' && <PrivacyPolicy />}

      <footer className="mt-12 text-center text-sm text-slate-500">
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex mb-8 items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            aria-label="Show application information"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>App Info</span>
          </button>
        </div>

        {/* Footer Navigation links */}
        <div className="mb-6 flex justify-center items-center gap-4 text-xs text-slate-400">
          <button onClick={() => navigateTo('about')} className="hover:underline hover:text-sky-400">About Us</button>
          <span>•</span>
          <button onClick={() => navigateTo('contact')} className="hover:underline hover:text-sky-400">Contact Us</button>
          <span>•</span>
          <button onClick={() => navigateTo('privacy')} className="hover:underline hover:text-sky-400">Privacy Policy</button>
          <span>•</span>
          <a href="https://marketplace.visualstudio.com/items?itemName=PackagePal" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-sky-400">Extension</a>
        </div>

        <p>&copy; {new Date().getFullYear()} Package Pal. Powered by Gemini (via Backend).</p>
        <p className="mt-4">Made with ❤️ in India by <a href="mailto:sagarkashyap.cc@gmail.com" className="text-sky-400 hover:underline">Sagar Kashyap</a></p>
      </footer>
      {isModalOpen && <InfoModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default App;