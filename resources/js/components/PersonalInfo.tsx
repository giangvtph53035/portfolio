import React from 'react';

interface PersonalInfoProps {
    className?: string;
}

export default function PersonalInfo({ className = '' }: PersonalInfoProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 ${className}`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg">
                        GV
                    </div>
                </div>

                {/* Personal Information */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Vũ Trường Giang
                    </h2>
                    <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
                        Full-Stack Developer
                    </p>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Là một Full-Stack Developer đam mê công nghệ, tôi có kinh nghiệm phát triển 
                            các ứng dụng web hiện đại sử dụng React, Laravel, và các công nghệ tiên tiến khác. 
                            Tôi luôn tìm kiếm cơ hội để học hỏi và áp dụng những công nghệ mới nhất 
                            vào các dự án thực tế.
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Kỹ năng chính
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'React', 'TypeScript', 'Laravel', 'PHP', 'Node.js', 
                                'MySQL', 'PostgreSQL', 'Tailwind CSS', 'Git', 'Docker'
                            ].map((skill) => (
                                <span
                                    key={skill}
                                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}