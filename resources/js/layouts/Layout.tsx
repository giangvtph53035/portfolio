import { Head, Link } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function Layout({ children, title = 'Portfolio' }: LayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link 
                                    href="/" 
                                    className="text-xl font-bold text-gray-900 dark:text-white"
                                >
                                    Portfolio
                                </Link>
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link
                                        href="/"
                                        className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        {t('common:home')}
                                    </Link>
                                    <Link
                                        href="/projects"
                                        className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        {t('common:projects')}
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                </nav>
                <main>{children}</main>
            </div>
        </>
    );
}
