import React from 'react';
import { LANGUAGES, LANGUAGE_ICONS } from '../constants';
import { ProgrammingLanguage } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: ProgrammingLanguage;
  onSelect: (lang: ProgrammingLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelect }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-app-accent font-bold">{'<>'}</span>
        <h3 className="text-sm font-semibold text-app-muted tracking-wider uppercase">Select Language</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {LANGUAGES.map((lang) => {
          const Icon = LANGUAGE_ICONS[lang];
          const isSelected = selectedLanguage === lang;
          
          return (
            <button
              key={lang}
              onClick={() => onSelect(lang)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200
                ${isSelected 
                  ? 'bg-app-accent/10 border-app-accent text-white' 
                  : 'bg-app-card border-app-border text-gray-400 hover:border-gray-600 hover:text-white'
                }
              `}
            >
              <Icon size={16} className={isSelected ? 'text-app-accent' : 'text-gray-500'} />
              <span className="text-sm font-medium">{lang}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
