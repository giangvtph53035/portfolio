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
    stargazers_count: number;
    forks_count: number;
    language: string;
    topics: string[];
    updated_at: string;
}

interface ProjectsResponse {
    success: boolean;
    data: Project[];
    message?: string;
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface TechnologiesResponse {
    success: boolean;
    data: string[];
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTechnology, setSelectedTechnology] = useState('');
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
    const [sortBy, setSortBy] = useState('updated_at');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        fetchTechnologies();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, selectedTechnology, showFeaturedOnly, sortBy, sortDirection]);

    useEffect(() => {
        fetchProjects();
    }, [currentPage, searchTerm, selectedTechnology, showFeaturedOnly, sortBy, sortDirection]);

    const fetchTechnologies = async () => {
        try {
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/api/v1/projects/technologies`);
            
            if (response.ok) {
                const data: TechnologiesResponse = await response.json();
                if (data.success) {
                    setTechnologies(data.data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch technologies:', err);
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                page: currentPage.toString(),
                per_page: '12',
            });

            if (searchTerm) params.append('search', searchTerm);
            if (selectedTechnology) params.append('technology', selectedTechnology);
            if (showFeaturedOnly) params.append('featured', 'true');
            if (sortBy) params.append('sort', sortBy);
            if (sortDirection) params.append('direction', sortDirection);
            
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/api/v1/projects?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data: ProjectsResponse = await response.json();
            
            if (data.success && data.data && Array.isArray(data.data)) {
                setProjects(data.data);
                setTotalPages(data.meta?.last_page || 1);
                setTotalProjects(data.meta?.total || 0);
            } else {
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

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTechnology('');
        setShowFeaturedOnly(false);
        setSortBy('updated_at');
        setSortDirection('desc');
        setCurrentPage(1);
    };

    if (loading && projects.length === 0) {
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

    return (
        <Layout title="Dự án Portfolio">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Tất cả dự án
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Khám phá toàn bộ {totalProjects} dự án từ GitHub repositories của tôi
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tìm kiếm
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tên dự án, mô tả..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Technology Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Công nghệ
                                </label>
                                <select
                                    value={selectedTechnology}
                                    onChange={(e) => setSelectedTechnology(e.target.value)}
                                    title="Chọn công nghệ để lọc"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả công nghệ</option>
                                    {technologies.map((tech) => (
                                        <option key={tech} value={tech}>
                                            {tech}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sắp xếp theo
                                </label>
                                <select
                                    value={`${sortBy}-${sortDirection}`}
                                    onChange={(e) => {
                                        const [sort, direction] = e.target.value.split('-');
                                        setSortBy(sort);
                                        setSortDirection(direction);
                                    }}
                                    title="Chọn cách sắp xếp"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="updated_at-desc">Cập nhật mới nhất</option>
                                    <option value="created_at-desc">Tạo mới nhất</option>
                                    <option value="stargazers_count-desc">Nhiều sao nhất</option>
                                    <option value="stargazers_count-asc">Ít sao nhất</option>
                                </select>
                            </div>

                            {/* Featured Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bộ lọc
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={showFeaturedOnly}
                                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        Chỉ dự án nổi bật
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Tìm thấy {totalProjects} dự án
                            </span>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                            <button 
                                onClick={() => fetchProjects()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {/* Projects Grid */}
                    {!loading && !error && (
                        <>
                            {projects.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                                        Không tìm thấy dự án nào phù hợp với bộ lọc.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                                        >
                                            {/* Project Header */}
                                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                                                <span className="text-white text-3xl font-bold">
                                                    {project.title.charAt(0)}
                                                </span>
                                                {project.featured && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                                                            ⭐ Nổi bật
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                {/* Title and Language */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
                                                        {project.title}
                                                    </h3>
                                                    {project.language && (
                                                        <div className="flex items-center gap-1 ml-2">
                                                            <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                {project.language}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span>{project.stargazers_count}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{project.forks_count}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Description */}
                                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                                    {project.description || 'Chưa có mô tả'}
                                                </p>

                                                {/* Technologies */}
                                                {project.technologies && project.technologies.length > 0 && (
                                                    <div className="mb-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.technologies.slice(0, 3).map((tech, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium"
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                            {project.technologies.length > 3 && (
                                                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full font-medium">
                                                                    +{project.technologies.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Topics */}
                                                {project.topics && project.topics.length > 0 && (
                                                    <div className="mb-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {project.topics.slice(0, 3).map((topic, index) => (
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
                                                    Cập nhật: {formatDate(project.updated_at)}
                                                </p>

                                                {/* Action buttons */}
                                                <div className="flex gap-2">
                                                    {project.demo_url && (
                                                        <a
                                                            href={project.demo_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium"
                                                        >
                                                            Demo
                                                        </a>
                                                    )}
                                                    {project.github_url && (
                                                        <a
                                                            href={project.github_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition-colors font-medium"
                                                        >
                                                            GitHub
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

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
                                        
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }
                                            
                                            return (
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
                                            );
                                        })}
                                        
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
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
