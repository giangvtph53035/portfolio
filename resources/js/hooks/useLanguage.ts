import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const useLanguage = () => {
    const { i18n } = useTranslation();
    const [isChanging, setIsChanging] = useState(false);

    const changeLanguage = async (lng: string) => {
        try {
            setIsChanging(true);
            
            // Change language in i18next
            await i18n.changeLanguage(lng);
            
            // Note: Language preference is stored client-side only
            // No need to sync with backend for static deployment
            
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            setIsChanging(false);
        }
    };

    const getSupportedLanguages = () => [
        { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese' },
        { code: 'en', name: 'English', englishName: 'English' }
    ];

    return {
        currentLanguage: i18n.language,
        changeLanguage,
        getSupportedLanguages,
        isChanging,
    };
};