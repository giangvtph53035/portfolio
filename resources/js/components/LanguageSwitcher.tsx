import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe, Check } from 'lucide-react';

export default function LanguageSwitcher() {
    const { t } = useTranslation();
    const { currentLanguage, changeLanguage, getSupportedLanguages, isChanging } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = getSupportedLanguages();
    const currentLang = languages.find(lang => lang.code === currentLanguage);

    const handleLanguageChange = async (langCode: string) => {
        if (langCode !== currentLanguage) {
            await changeLanguage(langCode);
        }
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-2 px-3"
                    disabled={isChanging}
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline-block">
                        {currentLang?.name || t('common:language')}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium">{language.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {language.englishName}
                            </span>
                        </div>
                        {currentLanguage === language.code && (
                            <Check className="h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}