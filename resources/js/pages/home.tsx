import Layout from '@/layouts/Layout';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Repository {
    id: number;
    title: string;
    slug: string;
    description: string;
    technologies: string[];
    github_url?: string;
    demo_url?: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    topics: string[];
    updated_at: string;
}

interface FeaturedProjectsResponse {
    success: boolean;
    data: Repository[];
    message?: string;
}

export default function Home() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeaturedRepositories();
    }, []);

    const fetchFeaturedRepositories = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const baseUrl = window.location.origin;
            const apiUrl = `${baseUrl}/api/v1/projects/featured`;
            console.log('Fetching from:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data: FeaturedProjectsResponse = await response.json();
            console.log('API Response:', data);
            
            if (data.success && data.data && Array.isArray(data.data)) {
                // Lấy tối đa 4 repositories
                console.log('Repositories found:', data.data.length);
                setRepositories(data.data.slice(0, 4));
            } else {
                console.error('Invalid response format:', data);
                throw new Error(data.message || 'Invalid response format');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getLanguageColor = (language: string) => {
        const colors: { [key: string]: string } = {
            'JavaScript': 'bg-yellow-400',
            'TypeScript': 'bg-blue-400',
            'Python': 'bg-green-400',
            'PHP': 'bg-purple-400',
            'Java': 'bg-red-400',
            'C#': 'bg-green-500',
            'Go': 'bg-cyan-400',
            'Rust': 'bg-orange-400',
            'Vue': 'bg-green-400',
            'React': 'bg-blue-400',
        };
        return colors[language] || 'bg-gray-400';
    };

    return (
        <Layout title="Portfolio - Giang Vũ">
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                {/* Hero Section */}
                <section className="container mx-auto px-6 pt-20 pb-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Xin chào, tôi là{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Giang Vũ
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
                            Nhà phát triển Full-Stack với đam mê tạo ra những sản phẩm công nghệ ý nghĩa
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/projects"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                            >
                                Xem dự án
                            </Link>
                            <a
                                href="#featured-projects"
                                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                Tìm hiểu thêm
                            </a>
                        </div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section id="featured-projects" className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Dự án nổi bật
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Một số dự án gần đây mà tôi đã phát triển từ GitHub repositories
                        </p>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                            <button 
                                onClick={fetchFeaturedRepositories}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {repositories.map((repo) => (
                                    <div
                                        key={repo.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                        {repo.title}
                                                    </h3>
                                                    {repo.language && (
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                {repo.language}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span>{repo.stargazers_count}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{repo.forks_count}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                                {repo.description || 'Chưa có mô tả'}
                                            </p>

                                            {/* Technologies */}
                                            {repo.technologies && repo.technologies.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {repo.technologies.slice(0, 3).map((tech, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {repo.technologies.length > 3 && (
                                                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full font-medium">
                                                                +{repo.technologies.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Topics */}
                                            {repo.topics && repo.topics.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {repo.topics.slice(0, 4).map((topic, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded font-medium"
                                                            >
                                                                #{topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Date */}
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                Cập nhật: {formatDate(repo.updated_at)}
                                            </p>

                                            {/* Action buttons */}
                                            <div className="flex gap-3">
                                                {repo.demo_url && (
                                                    <a
                                                        href={repo.demo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                                                    >
                                                        Demo
                                                    </a>
                                                )}
                                                {repo.github_url && (
                                                    <a
                                                        href={repo.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                                                    >
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* See More Button */}
                            <div className="text-center">
                                <Link
                                    href="/projects"
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Xem tất cả dự án
                                    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </>
                    )}
                </section>

                {/* About Section */}
                <section className="bg-gray-100 dark:bg-gray-800 py-16">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Về tôi
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Tôi là một nhà phát triển Full-Stack với kinh nghiệm trong việc xây dựng 
                                các ứng dụng web hiện đại. Tôi có đam mê với công nghệ mới và luôn tìm 
                                cách cải thiện kỹ năng lập trình của mình.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {repositories.length}+
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">Dự án</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)}+
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">GitHub Stars</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {Array.from(new Set(repositories.flatMap(repo => repo.technologies))).length}+
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">Công nghệ</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        100%
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">Đam mê</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}