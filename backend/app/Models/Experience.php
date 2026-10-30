<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'company', 'position', 'location', 'employment_type', 'description',
        'technologies', 'start_date', 'end_date', 'is_current', 'sort_order',
    ];

    protected $casts = [
        'technologies' => 'array',
        'is_current' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
