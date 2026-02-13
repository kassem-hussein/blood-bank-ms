<?php

namespace Tests\Feature;

use App\Models\Donor;
use App\Models\Test as BloodTest;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BloodUnitTestsTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    use RefreshDatabase;

    private function insertDonor() : Donor{
        $donor = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        return $donor;
    }

    private function insertBloodUnit($donor) : Unit{
        $currentDate  = Carbon::now();
        $currentDateFormated  = $currentDate->format('Y/m/d');
        $expiredDate  = $currentDate->addMonths(3)->format('Y/m/d');
        $unit = Unit::create([
            'bloodType'=>'A+',
            'type'=>'دم كامل',
            'status'=>'available',
            'donationDate'=>$currentDateFormated,
            'expiredDate'=>$expiredDate,
            'donor_id'=>$donor->id
        ]);
        return $unit;
    }
    private function insertBloodTests($unit): BloodTest{
            $item = BloodTest::create([
            'bloodUnit_id'=>$unit->id,
            'HIV'=>FALSE,
            'hepatitis_B'=>FALSE,
            'hepatitis_C'=>FALSE,
            'syphilis'=>FALSE,
            'malaria'=>FALSE
        ]);
        return $item;
    }
    public function test_can_insert_new_record(): void
    {
        // donor
        $donor = $this->insertDonor();
        // BloodUnit
        $unit  = $this->insertBloodUnit($donor);
        // make tests
        $item = $this->insertBloodTests($unit);

        $this->assertDatabaseHas('tests',['bloodUnit_id'=>$unit->id]);
    }

    public function test_can_update_blood_tests(){
            // donor
        $donor = $this->insertDonor();
        // BloodUnit
        $unit  = $this->insertBloodUnit($donor);
        // make tests
        $item = $this->insertBloodTests($unit);

        $item->update([
            'HIV'=>TRUE
        ]);

        $this->assertEquals($item->HIV,TRUE);
    }

    public function test_can_delete_blood_tests(){
        $donor = $this->insertDonor();
        $unit  = $this->insertBloodUnit($donor);
        $test  = $this->insertBloodTests($unit);
        $test->delete();

        $this->assertDatabaseMissing('tests',['id'=>$test->id]);
    }

}
