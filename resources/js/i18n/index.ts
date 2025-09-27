import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        common: {
            hello: 'Hello, I am',
            name: 'Giang Vu',
            role: 'Full-Stack Developer',
            about_me: 'About Me',
            featured_projects: 'Featured Projects',
            all_projects: 'All Projects',
            view_projects: 'View Projects',
            view_all_projects: 'View All Projects',
            contact: 'Contact',
            projects: 'Projects',
            project: 'Project',
            loading_projects: 'Loading projects...',
            no_projects_found: 'No projects found matching the filters.',
            try_again: 'Try Again',
            demo: 'Demo',
            github: 'GitHub',
            updated: 'Updated',
            stars: 'Stars',
            forks: 'Forks',
            technologies: 'Technologies',
            search_placeholder: 'Project name, description...',
            sort_by: 'Sort by',
            updated_at: 'Last Updated',
            created_at: 'Created Date',
            stargazers_count: 'Stars',
            featured_only: 'Featured Only',
            found_projects: 'Found {{count}} projects',
            github_stars: 'GitHub Stars',
            no_description: 'No description available',
            some_recent_projects: 'Some recent projects I\'ve developed from GitHub repositories',
            full_stack_intern: 'I am a Full-Stack intern with some experience in building web applications. I have a passion for new technologies and always look for ways to improve my programming skills.',
            language: 'Language',
            english: 'English',
            vietnamese: 'Vietnamese',
            explore_all: 'Explore all {{count}} projects from my GitHub repositories',
            personal_info: 'Personal Information',
            contact_info: 'Contact Information',
            bio: 'Bio',
            bio_content: 'I am passionate about creating innovative web solutions and constantly learning new technologies. Currently focusing on modern web development with React, Laravel, and cloud technologies.',
            location: 'Location',
            email: 'Email',
            phone: 'Phone',
            website: 'Website',
            social_media: 'Social Media',
            experience: 'Experience',
            skills: 'Skills',
            education: 'Education',
            close: 'Close',
            home: 'Home',
            dashboard: 'Dashboard',
            settings: 'Settings',
            contact_me: 'Contact Me',
            contact_description: 'Let\'s connect and discuss collaboration opportunities',
            ready_to_collaborate: 'Ready to collaborate?',
            collaboration_description: 'I\'m always open to exciting projects and new learning opportunities',
            send_email: 'Send me an email'
        }
    },
    vi: {
        common: {
            hello: 'Xin chào, tôi là',
            name: 'Giang Vũ',
            role: 'Nhân viên lập trình Full-Stack',
            about_me: 'Về tôi',
            featured_projects: 'Dự án nổi bật',
            all_projects: 'Tất cả dự án',
            view_projects: 'Xem dự án',
            view_all_projects: 'Xem tất cả dự án',
            contact: 'Liên hệ',
            projects: 'Dự án',
            project: 'Dự án',
            loading_projects: 'Đang tải dự án...',
            no_projects_found: 'Không tìm thấy dự án nào phù hợp với bộ lọc.',
            try_again: 'Thử lại',
            demo: 'Demo',
            github: 'GitHub',
            updated: 'Cập nhật',
            stars: 'Sao',
            forks: 'Fork',
            technologies: 'Công nghệ',
            search_placeholder: 'Tên dự án, mô tả...',
            sort_by: 'Sắp xếp theo',
            updated_at: 'Cập nhật gần nhất',
            created_at: 'Ngày tạo',
            stargazers_count: 'Sao',
            featured_only: 'Chỉ dự án nổi bật',
            found_projects: 'Tìm thấy {{count}} dự án',
            github_stars: 'GitHub Stars',
            no_description: 'Chưa có mô tả',
            some_recent_projects: 'Một số dự án gần đây mà tôi đã phát triển từ GitHub repositories',
            full_stack_intern: 'Tôi là một thực tập sinh Full-Stack với một số kinh nghiệm trong việc xây dựng các ứng dụng web. Tôi có đam mê với công nghệ mới và luôn tìm cách cải thiện kỹ năng lập trình của mình.',
            language: 'Ngôn ngữ',
            english: 'Tiếng Anh',
            vietnamese: 'Tiếng Việt',
            explore_all: 'Khám phá toàn bộ {{count}} dự án từ GitHub repositories của tôi',
            personal_info: 'Thông tin cá nhân',
            contact_info: 'Thông tin liên hệ',
            bio: 'Tiểu sử',
            bio_content: 'Tôi đam mê tạo ra các giải pháp web sáng tạo và không ngừng học hỏi các công nghệ mới. Hiện tại đang tập trung vào phát triển web hiện đại với React, Laravel và công nghệ đám mây.',
            location: 'Địa điểm',
            email: 'Email',
            phone: 'Điện thoại',
            website: 'Website',
            social_media: 'Mạng xã hội',
            experience: 'Kinh nghiệm',
            skills: 'Kỹ năng',
            education: 'Học vấn',
            close: 'Đóng',
            home: 'Trang chủ',
            dashboard: 'Bảng điều khiển',
            settings: 'Cài đặt',
            contact_me: 'Liên hệ với tôi',
            contact_description: 'Hãy kết nối và thảo luận về các cơ hội hợp tác',
            ready_to_collaborate: 'Sẵn sàng hợp tác?',
            collaboration_description: 'Tôi luôn mở lòng với các dự án thú vị và cơ hội học hỏi mới',
            send_email: 'Gửi email cho tôi'
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'vi', // default language
        fallbackLng: 'en',
        
        detection: {
            order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
            caches: ['localStorage', 'cookie'],
            lookupLocalStorage: 'i18nextLng',
            lookupCookie: 'i18nextLng',
        },

        interpolation: {
            escapeValue: false, // react already safes from xss
        },

        ns: ['common'],
        defaultNS: 'common',
    });

export default i18n;