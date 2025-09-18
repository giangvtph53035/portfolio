import Layout from '@/layouts/Layout';
import { useState, useEffect } from 'react';

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    technologies: string[];
    status: string;
    github_url?: string;
    demo_url?: string;
    featured: boolean;
    published_at: string;
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface ProjectsResponse {
    data: Project[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProjects();
    }, [currentPage]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/api/v1/projects?page=${currentPage}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data: ProjectsResponse = await response.json();
            console.log('API Response:', data);
            
            if (data.data && Array.isArray(data.data)) {
                setProjects(data.data);
                setTotalPages(data.meta?.last_page || 1);
            } else {
                throw new Error('Invalid response format');
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

    if (loading) {
        return (
            <Layout title="Dự án Portfolio">
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải dự án...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title="Dự án Portfolio">
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                        <button 
                            onClick={() => fetchProjects()}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Dự án Portfolio">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Dự án của tôi
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Khám phá các dự án mà tôi đã phát triển với các công nghệ hiện đại
                        </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Project Image Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">
                                        {project.title.charAt(0)}
                                    </span>
                                </div>

                                <div className="p-6">
                                    {/* Featured badge */}
                                    {project.featured && (
                                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold mb-2">
                                            Nổi bật
                                        </span>
                                    )}

                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {project.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Technologies */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 3).map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 3 && (
                                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <p className="text-sm text-gray-500 mb-4">
                                        {formatDate(project.published_at)}
                                    </p>

                                    {/* Action buttons */}
                                    <div className="flex gap-2">
                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                            >
                                                Demo
                                            </a>
                                        )}
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <nav className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
