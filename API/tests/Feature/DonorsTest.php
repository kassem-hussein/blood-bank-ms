<?php

namespace Tests\Feature;

use App\Models\Donor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DonorsTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    use RefreshDatabase;
    public function test_can_insert(){
        $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        $this->assertDatabaseHas('donors',['nationalityID'=>'11111111111']);
    }
    public function test_get_all(): void
    {
        $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        $this->assertDatabaseCount('donors',1);
    }

    public function test_can_update_donor(){
        $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        $record->update([
            'bloodType'=>'A-'
        ]);

        $bloodType = $record->bloodType;

        $this->assertEquals('A-',$bloodType);
    }

    public function test_can_delete_donor(){
        $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        $record->delete();
        $this->assertDatabaseMissing('donors',['nationalityID'=>'11111111111']);
    }

}
