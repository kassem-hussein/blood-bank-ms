<?php

namespace Tests\Feature;

use App\Models\Donor;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BloodUnitTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic unit test example.
     */
    public function test_can_get_all_units(): void
    {
        $currentDate  = Carbon::now();
        $currentDateFormated  = $currentDate->format('Y/m/d');
        $expiredDate  = $currentDate->addMonths(3)->format('Y/m/d');
        $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        Unit::create([
            'bloodType'=>'A+',
            'type'=>'دم كامل',
            'status'=>'available',
            'donationDate'=>$currentDateFormated,
            'expiredDate'=>$expiredDate,
            'donor_id'=>$record->id
        ]);
        $data = Unit::all();
        $item = $data->first();
        $this->assertDatabaseCount('blood_units',1);
        $this->assertDatabaseHas('blood_units',['id'=>$item->id]);
    }

    public function test_can_get_single_unit(){
        $item = Unit::find(666);
        $this->assertNull($item);
    }

    public function test_can_update_unit(){
        $currentDate  = Carbon::now();
        $currentDateFormated  = $currentDate->format('Y/m/d');
        $expiredDate  = $currentDate->addMonths(3)->format('Y/m/d');
        $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        $item = Unit::create([
            'bloodType'=>'A+',
            'type'=>'دم كامل',
            'status'=>'available',
            'donationDate'=>$currentDateFormated,
            'expiredDate'=>$expiredDate,
            'donor_id'=>$record->id
        ]);

        $item->update([
            'bloodType'=>'AB+'
        ]);

        $this->assertEquals($item->bloodType,'AB+');
    }

    public function test_can_delete_unit(){
        $currentDate  = Carbon::now();
        $currentDateFormated  = $currentDate->format('Y/m/d');
        $expiredDate  = $currentDate->addMonths(3)->format('Y/m/d');
        $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        $item = Unit::create([
            'bloodType'=>'A+',
            'type'=>'دم كامل',
            'status'=>'available',
            'donationDate'=>$currentDateFormated,
            'expiredDate'=>$expiredDate,
            'donor_id'=>$record->id
        ]);

        $id = $item->id;
        $item->delete();
        $this->assertDatabaseMissing('blood_units',['id'=>$id]);
    }


}
