<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('blood_units','id');
            $table->boolean('HIV');
            $table->boolean('hepatitis_B');
            $table->boolean('hepatitis_C');
            $table->boolean('syphilis');
            $table->boolean('malaria');
            $table->date('testDate')->default(Carbon::now()->format('Y-m-d'));
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
