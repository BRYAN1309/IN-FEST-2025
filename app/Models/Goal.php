<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'priority',
        'due_date',
        'tasks',
        'user_id',
    ];

    protected $casts = [
        'due_date' => 'date',
        'tasks' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}