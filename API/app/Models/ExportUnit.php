<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExportUnit extends Model
{
    protected $table = 'export_units';
    protected $guarded = [];


    public function unit():BelongsTo{
        return $this->belongsTo(Unit::class,'unit_id','id');
    }
    public function export():BelongsTo{
        return $this->belongsTo(Export::class,'export_id','id');
    }
}
