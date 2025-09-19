import React from 'react';

interface ContactInfoProps {
    className?: string;
}

export default function ContactInfo({ className = '' }: ContactInfoProps) {
    const contactMethods = [
        {
            type: 'email',
            label: 'Email',
            value: 'gvutruong871@gmail.com',
            href: 'mailto:gvutruong871@gmail.com',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
            )
        },
        {
            type: 'phone',
            label: 'Điện thoại',
            value: '+84 349370112',
            href: 'tel:+84349370112',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
            )
        },
        {
            type: 'github',
            label: 'GitHub',
            value: 'github.com/giangvtph53035',
            href: 'https://github.com/giangvtph53035',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/vu.giang.60662',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 ${className}`}>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Liên hệ với tôi
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Hãy kết nối và thảo luận về các cơ hội hợp tác
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {contactMethods.map((contact) => (
                    <a
                        key={contact.type}
                        href={contact.href}
                        target={contact.type === 'github' || contact.type === 'linkedin' ? '_blank' : undefined}
                        rel={contact.type === 'github' || contact.type === 'linkedin' ? 'noopener noreferrer' : undefined}
                        className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
                    >
                        <div className="flex-shrink-0 mr-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-200">
                                {contact.icon}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {contact.label}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 break-all">
                                {contact.value}
                            </p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>

            {/* Social Media */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Mạng xã hội
                </h3>
                <div className="flex justify-center space-x-6">
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-110"
                            title={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Sẵn sàng hợp tác?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Tôi luôn mở lòng với các dự án thú vị và cơ hội học hỏi mới
                    </p>
                    <a
                        href="mailto:giangvtph53035@fpt.edu.vn"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        Gửi email cho tôi
                        <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}