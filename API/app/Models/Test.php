<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Test extends Model
{
    protected $table = 'tests';
    protected $guarded = [];

    public function unit():BelongsTo{
        return $this->belongsTo(Unit::class,'unit_id','id');
    }
}
