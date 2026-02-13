<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Import extends Model
{
    protected $table = 'imports';
    protected $guarded = [];

    public function units():HasMany{
        return $this->hasMany(Unit::class,'import_id','id');
    }
}
