<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Donor extends Model
{
    
    protected $table = 'donors';
    protected $guarded = [];

    public function units():HasMany{
      return  $this->hasMany(Unit::class,'donor_id','id');
    }
}
