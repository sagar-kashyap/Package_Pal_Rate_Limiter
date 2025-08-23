
import React from 'react';
import { PackageSuggestion } from '../types';

interface PackageResultCardProps {
  packageInfo: PackageSuggestion;
  index: number;
}

const PackageResultCard: React.FC<PackageResultCardProps> = ({ packageInfo, index }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl hover:shadow-sky-500/30 transition-shadow duration-300 ease-in-out">
      <div className="flex items-center mb-3">
        <span className="bg-sky-500 text-slate-900 text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full mr-3">{index + 1}</span>
         <h3 className="text-xl font-semibold text-sky-400">
           {packageInfo.url ? (
            <a href={packageInfo.url} target="_blank" rel="noopener noreferrer" className="hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded inline-flex items-center gap-1.5">
              {packageInfo.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <span>{packageInfo.name}</span>
          )}
        </h3>
      </div>
      <p className="text-slate-300 text-sm">{packageInfo.description}</p>
    </div>
  );
};

export default PackageResultCard;
    