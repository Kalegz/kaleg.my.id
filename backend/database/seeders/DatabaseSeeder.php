<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\Experience;
use App\Models\Post;
use App\Models\Profile;
use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        AdminUser::firstOrCreate(
            ['email' => 'giselok1215@gmail.com'],
            [
                'name' => 'Kaleg Admin',
                'password' => Hash::make(env('ADMIN_INITIAL_PASSWORD', 'kalegz1215')),
            ]
        );

        // Profile
        Profile::firstOrCreate(
            ['email' => 'hello@kaleg.my.id'],
            [
                'name' => 'Kaleg',
                'title' => 'Full Stack Developer',
                'tagline' => 'Building beautiful, scalable web applications',
                'bio' => 'I\'m a passionate full stack developer with expertise in building modern web applications. I love crafting elegant solutions to complex problems and am always exploring new technologies.',
                'email' => 'hello@kaleg.my.id',
                'location' => 'Indonesia',
                'github_url' => 'https://github.com/kaleg',
                'linkedin_url' => 'https://linkedin.com/in/kaleg',
                'is_available' => true,
            ]
        );

        // Skills
        $skills = [
            ['name' => 'React', 'category' => 'Frontend', 'level' => 90, 'icon' => 'react', 'is_featured' => true],
            ['name' => 'Vue.js', 'category' => 'Frontend', 'level' => 85, 'icon' => 'vuejs', 'is_featured' => false],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'level' => 85, 'icon' => 'typescript', 'is_featured' => true],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'level' => 90, 'icon' => 'tailwindcss', 'is_featured' => false],
            ['name' => 'Laravel', 'category' => 'Backend', 'level' => 90, 'icon' => 'laravel', 'is_featured' => true],
            ['name' => 'Node.js', 'category' => 'Backend', 'level' => 80, 'icon' => 'nodejs', 'is_featured' => false],
            ['name' => 'PHP', 'category' => 'Backend', 'level' => 88, 'icon' => 'php', 'is_featured' => false],
            ['name' => 'Python', 'category' => 'Backend', 'level' => 75, 'icon' => 'python', 'is_featured' => false],
            ['name' => 'MySQL', 'category' => 'Database', 'level' => 85, 'icon' => 'mysql', 'is_featured' => false],
            ['name' => 'PostgreSQL', 'category' => 'Database', 'level' => 80, 'icon' => 'postgresql', 'is_featured' => false],
            ['name' => 'Redis', 'category' => 'Database', 'level' => 70, 'icon' => 'redis', 'is_featured' => false],
            ['name' => 'Docker', 'category' => 'DevOps', 'level' => 78, 'icon' => 'docker', 'is_featured' => true],
            ['name' => 'Linux', 'category' => 'DevOps', 'level' => 82, 'icon' => 'linux', 'is_featured' => false],
            ['name' => 'Nginx', 'category' => 'DevOps', 'level' => 75, 'icon' => 'nginx', 'is_featured' => false],
            ['name' => 'Git', 'category' => 'Tools', 'level' => 90, 'icon' => 'git', 'is_featured' => false],
        ];

        foreach ($skills as $i => $skill) {
            Skill::firstOrCreate(['name' => $skill['name']], array_merge($skill, ['sort_order' => $i]));
        }

        // Experiences
        $experiences = [
            [
                'company' => 'Freelance',
                'position' => 'Full Stack Developer',
                'location' => 'Remote',
                'employment_type' => 'Freelance',
                'description' => 'Developing custom web applications for clients using Laravel, React, and Vue.js. Managing deployments on Linux servers with Nginx.',
                'technologies' => ['Laravel', 'React', 'Vue.js', 'MySQL', 'Nginx'],
                'start_date' => '2023-01-01',
                'end_date' => null,
                'is_current' => true,
            ],
            [
                'company' => 'Tech Startup',
                'position' => 'Backend Developer',
                'location' => 'Indonesia',
                'employment_type' => 'Full-time',
                'description' => 'Built and maintained RESTful APIs for a SaaS platform serving thousands of users. Optimized database queries and implemented caching strategies.',
                'technologies' => ['Laravel', 'MySQL', 'Redis', 'Docker'],
                'start_date' => '2021-06-01',
                'end_date' => '2022-12-31',
                'is_current' => false,
            ],
        ];

        foreach ($experiences as $i => $exp) {
            Experience::firstOrCreate(
                ['company' => $exp['company'], 'position' => $exp['position']],
                array_merge($exp, ['sort_order' => $i])
            );
        }

        // Sample Blog Post
        Post::firstOrCreate(
            ['slug' => 'getting-started-with-laravel-and-react'],
            [
                'title' => 'Getting Started with Laravel & React',
                'excerpt' => 'A complete guide to building modern full-stack applications using Laravel as a REST API backend and React as the frontend.',
                'content' => '# Getting Started with Laravel & React

Building a modern web application requires a solid backend and an interactive frontend. Laravel and React are a perfect combination for this purpose.

## Why Laravel?

Laravel is an elegant PHP framework with expressive syntax and built-in features like:
- Eloquent ORM for database management
- API resource routing
- Authentication via Sanctum
- Queue jobs and background tasks

## Why React?

React is a component-based JavaScript library that makes building interactive UIs straightforward and maintainable.

## Setting Up the Project

Start by creating a new Laravel project and configure it for API mode...

```bash
composer create-project laravel/laravel my-api
cd my-api
composer require laravel/sanctum
```

This is just the beginning of your journey with Laravel and React!',
                'category' => 'Tutorial',
                'tags' => ['Laravel', 'React', 'PHP', 'JavaScript'],
                'status' => 'published',
                'read_time' => 5,
                'published_at' => now(),
            ]
        );
    }
}
