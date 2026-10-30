<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name', 'title', 'tagline', 'bio', 'email', 'location',
        'avatar_url', 'github_url', 'linkedin_url', 'twitter_url',
        'instagram_url', 'resume_url', 'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];
}
