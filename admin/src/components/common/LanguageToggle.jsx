import React, { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LanguageToggle({ variant = 'default' }) {
  const { currentLanguage, changeLanguage, supportedLanguages, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode)
    setIsOpen(false)
  }

  const currentLangData = supportedLanguages.find(l => l.code === currentLanguage)

  // Compact variant for login/signup pages
  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-dark-800/50 hover:bg-dark-800 border border-dark-700 rounded-lg transition text-dark-300 hover:text-dark-100 disabled:opacity-50"
          title="Change Language"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{currentLangData?.flag}</span>
          <span className="text-xs font-semibold">{currentLangData?.code.toUpperCase()}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50 animate-fade-in">
            <div className="p-2">
              <div className="px-3 py-2 border-b border-dark-700 mb-2">
                <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Select Language</p>
              </div>
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-sm ${
                    currentLanguage === lang.code
                      ? 'bg-deepBlue-600 text-white'
                      : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <p className="font-semibold">{lang.name}</p>
                      <p className="text-xs opacity-70">{lang.nativeName}</p>
                    </div>
                  </div>
                  {currentLanguage === lang.code && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default variant for header/sidebar
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 px-3 py-2 hover:bg-dark-800 rounded-lg transition text-dark-300 hover:text-dark-100 disabled:opacity-50"
        title="Change Language"
      >
        <Globe className="w-5 h-5" />
        <span className="text-lg">{currentLangData?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50 animate-fade-in">
          <div className="p-2">
            <div className="px-3 py-2 border-b border-dark-700 mb-2">
              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Select Language</p>
            </div>
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-sm ${
                  currentLanguage === lang.code
                    ? 'bg-deepBlue-600 text-white'
                    : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{lang.flag}</span>
                  <div className="text-left">
                    <p className="font-semibold">{lang.name}</p>
                    <p className="text-xs opacity-70">{lang.nativeName}</p>
                  </div>
                </div>
                {currentLanguage === lang.code && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
