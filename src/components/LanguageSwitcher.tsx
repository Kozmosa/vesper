import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button 
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
      <button 
        className={i18n.language === 'zh' ? 'active' : ''}
        onClick={() => changeLanguage('zh')}
      >
        中文
      </button>
    </div>
  );
};