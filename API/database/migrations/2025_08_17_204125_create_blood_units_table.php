<?php

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
        Schema::create('blood_units', function (Blueprint $table) {
            $table->id();
            $table->enum('bloodType',['A+','A-','B+','B-','AB+','AB-','O+','O-']);
            $table->string('type');
            $table->integer('volume')->default(400);
            $table->enum('status',['used','available','expired','testing','invalid'])->default('testing');
            $table->date('donationDate');
            $table->date('expiredDate');
            $table->foreignId('donor_id')->nullable()->constrained('donors','id');
            $table->foreignId('import_id')->nullable()->constrained('imports','id')->cascadeOnDelete();
            $table->foreignId('export_id')->nullable()->constrained('exports','id')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blood_units');
    }
};
