<?php

namespace Database\Seeders;

use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name'=>'nurse',
            'username' => 'nurse',
            'password' => '12345678',
            'role'=>'user'
        ]);
        User::create([
            'name'=>'doctor',
            'username' => 'doctor',
            'password' => '12345678',
            'role'=>'doctor'
        ]);

        User::create([
            'name'=>'admin',
            'username' => 'admin',
            'password' => '12345678',
            'role'=>'admin'
        ]);







        // for($i=1;$i<5;$i++){
        //     Unit::create([
        //         'donationDate'=>Carbon::now()->format('Y/m/d'),
        //         'expiredDate'=>Carbon::now()->addMonths(3)->format('Y/m/d'),
        //         'bloodType'=>'AB+',
        //         'type'=>'ثلاثي',
        //         'status'=>'available',
        //         'donor_id'=>2
        //     ]);
        // }
    }
}
