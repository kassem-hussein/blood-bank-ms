<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Export extends Model
{
    protected $table= 'exports';
    protected $guarded  = [];

    public function units():HasMany{
       return $this->hasMany(Unit::class,'export_id','id');
    }



}
