<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
    'author',
    'desc',
    'publish_year',
    'title',
    'url_article',
    'url_image'
    ];

}