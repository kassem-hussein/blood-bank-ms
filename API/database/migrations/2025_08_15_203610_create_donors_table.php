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
        Schema::create('donors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nationalityID')->unique();
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique();
            $table->enum('bloodType',['A+','A-','B+','B-','AB+','AB-','O+','O-']);
            $table->date('lastDonation')->nullable();
            $table->date('DOB');
            $table->integer('donations')->default(0)->nullable();
            $table->boolean('qualified')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donors');
    }
};
