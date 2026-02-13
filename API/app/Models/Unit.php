<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Unit extends Model
{
    protected $table = 'blood_units';
    protected $guarded = [];
    protected $hidden = ['laravel_through_key'];

    public function donor() :BelongsTo{
        return $this->belongsTo(Donor::class,'donor_id','id');
    }
    public function test():HasOne{
        return $this->hasOne(Test::class,'bloodUnit_id','id');
    }

    
}
