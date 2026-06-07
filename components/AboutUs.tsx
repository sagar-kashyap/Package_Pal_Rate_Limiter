import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8 md:p-12 text-slate-300">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-4">
          About Package Pal
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Simplifying cross-language dependency translation and library discovery for developers worldwide.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
            <span className="text-sky-400">💡</span> Our Mission
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            As developers transition between programming languages—whether learning a new framework, refactoring legacy services, or rewriting a tool in a more efficient language—finding the right library equivalents can be time-consuming. 
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mt-2">
            Package Pal was created to instantly bridge that gap using state-of-the-art AI. We help you map your existing knowledge from one package ecosystem straight into another.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
            <span className="text-sky-400">⚡</span> Key Features
          </h2>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span><strong>Instant Translation:</strong> Discover similar package alternatives with documentation URLs in seconds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span><strong>Cross-Language Support:</strong> Search across 15+ popular languages including Go, Rust, Python, JavaScript, and Java.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span><strong>API Key Control:</strong> Option to run queries completely client-side using your own Gemini API key for higher rate limits.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-8 text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">Powered by Gemini</h3>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Package Pal leverages the speed and reasoning capabilities of Google's <strong>Gemini 2.5 Flash</strong> to analyze package functions and recommend the closest semantic matches.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
