<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'E-commerce Website',
                'slug' => 'e-commerce-website',
                'description' => 'Một website thương mại điện tử hiện đại với React và Laravel API',
                'content' => '# E-commerce Website

Dự án xây dựng website thương mại điện tử với đầy đủ tính năng:
- Quản lý sản phẩm
- Giỏ hàng và thanh toán
- Quản lý đơn hàng
- Dashboard admin

## Công nghệ sử dụng
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Laravel 11, MySQL
- Payment: Stripe API',
                'technologies' => ['React', 'Laravel', 'TypeScript', 'Tailwind CSS', 'MySQL', 'Stripe'],
                'status' => 'active',
                'github_url' => 'https://github.com/example/ecommerce',
                'demo_url' => 'https://ecommerce-demo.example.com',
                'featured' => true,
                'sort_order' => 1,
                'meta_description' => 'Website thương mại điện tử hiện đại với React và Laravel',
                'published_at' => now()->subDays(30),
            ],
            [
                'title' => 'Task Management App',
                'slug' => 'task-management-app',
                'description' => 'Ứng dụng quản lý công việc với tính năng real-time',
                'content' => '# Task Management App

Ứng dụng quản lý công việc cho team với các tính năng:
- Tạo và quản lý task
- Real-time notifications
- Team collaboration
- Time tracking

## Tính năng chính
- Drag & drop interface
- Real-time updates
- File attachments
- Team chat',
                'technologies' => ['Vue.js', 'Laravel', 'Socket.io', 'PostgreSQL', 'Redis'],
                'status' => 'active',
                'github_url' => 'https://github.com/example/task-manager',
                'demo_url' => 'https://tasks-demo.example.com',
                'featured' => true,
                'sort_order' => 2,
                'meta_description' => 'Ứng dụng quản lý công việc hiệu quả cho team',
                'published_at' => now()->subDays(20),
            ],
            [
                'title' => 'Blog Platform',
                'slug' => 'blog-platform',
                'description' => 'Nền tảng blog cá nhân với editor markdown',
                'content' => '# Blog Platform

Nền tảng blog cá nhân với giao diện thân thiện:
- Markdown editor
- SEO optimization
- Comment system
- Social sharing

## Đặc điểm
- Responsive design
- Fast loading
- SEO friendly
- Admin dashboard',
                'technologies' => ['Next.js', 'Node.js', 'MongoDB', 'Markdown'],
                'status' => 'active',
                'github_url' => 'https://github.com/example/blog-platform',
                'demo_url' => 'https://blog-demo.example.com',
                'featured' => false,
                'sort_order' => 3,
                'meta_description' => 'Nền tảng blog cá nhân với editor markdown',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Weather App',
                'slug' => 'weather-app',
                'description' => 'Ứng dụng thời tiết với giao diện đẹp mắt',
                'content' => '# Weather App

Ứng dụng thời tiết đơn giản nhưng đầy đủ tính năng:
- Current weather
- 7-day forecast
- Multiple locations
- Beautiful animations

## API Integration
- OpenWeatherMap API
- Geolocation API
- Local storage',
                'technologies' => ['React Native', 'TypeScript', 'OpenWeatherMap API'],
                'status' => 'active',
                'github_url' => 'https://github.com/example/weather-app',
                'demo_url' => 'https://weather-demo.example.com',
                'featured' => false,
                'sort_order' => 4,
                'meta_description' => 'Ứng dụng thời tiết với giao diện đẹp mắt',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Portfolio Website',
                'slug' => 'portfolio-website',
                'description' => 'Website portfolio cá nhân với thiết kế hiện đại',
                'content' => '# Portfolio Website

Website portfolio cá nhân để showcase các dự án:
- Project showcase
- About me section
- Contact form
- Blog integration

## Features
- Responsive design
- Dark/Light mode
- Animation effects
- Fast performance',
                'technologies' => ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
                'status' => 'active',
                'github_url' => 'https://github.com/example/portfolio',
                'demo_url' => 'https://portfolio-demo.example.com',
                'featured' => true,
                'sort_order' => 5,
                'meta_description' => 'Website portfolio cá nhân với thiết kế hiện đại',
                'published_at' => now(),
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create($projectData);
            
            // Add tags
            $tags = array_slice($projectData['technologies'], 0, 3); // Take first 3 technologies as tags
            $project->attachTags($tags);
        }
    }
}
