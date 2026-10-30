<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'name', 'category', 'icon', 'level', 'sort_order', 'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'level' => 'integer',
        'sort_order' => 'integer',
    ];
}
