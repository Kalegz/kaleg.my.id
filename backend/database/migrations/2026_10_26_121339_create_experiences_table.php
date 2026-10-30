<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('position');
            $table->string('location')->nullable();
            $table->string('employment_type')->default('Full-time'); // Full-time, Part-time, Freelance, etc.
            $table->text('description')->nullable();
            $table->json('technologies')->nullable(); // array of tech used
            $table->date('start_date');
            $table->date('end_date')->nullable(); // null means current
            $table->boolean('is_current')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
