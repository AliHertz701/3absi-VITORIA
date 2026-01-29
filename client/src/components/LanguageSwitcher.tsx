// components/LanguageSwitcher.tsx
import { Globe } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";
import { useState } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale, isRTL } = useLocale();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 group"
      aria-label={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
    >
      <Globe className="w-4 h-4 text-black/80 group-hover:text-black" />
      <span className="text-sm font-medium text-white uppercase tracking-wider">
        {locale === 'en' ? 'EN' : 'AR'}
      </span>
      <motion.div
        initial={false}
        animate={{ x: locale === 'ar' ? 2 : -2 }}
        className="text-xs text-white/60"
      >
        {locale === 'en' ? '→' : '←'}
      </motion.div>
    </motion.button>
  );
}

// Alternative: Dropdown version
export function LanguageSwitcherDropdown() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
      >
        <Globe className="w-4 h-4 text-white/80" />
        <span className="text-sm font-medium text-white uppercase tracking-wider">
          {locale.toUpperCase()}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => {
              setLocale('en');
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
              locale === 'en' ? 'text-gold font-medium' : 'text-gray-700'
            }`}
          >
            English
            {locale === 'en' && (
              <div className="w-2 h-2 rounded-full bg-gold" />
            )}
          </button>
          <button
            onClick={() => {
              setLocale('ar');
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
              locale === 'ar' ? 'text-gold font-medium' : 'text-gray-700'
            }`}
          >
            العربية
            {locale === 'ar' && (
              <div className="w-2 h-2 rounded-full bg-gold" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}