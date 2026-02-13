<?php

namespace Tests\Feature;

use App\Models\Unit;
use App\Models\Export;
use App\Models\ExportUnit;
use App\Models\Donor;
use Carbon\Carbon;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExportBloodTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    use RefreshDatabase;
    private function insertDonor():Donor{
       $record = Donor::create([
            'name'=>'Ali mohammed',
            'nationalityID'=> '11111111111',
            'email'=>'ali@gmail.com',
            'phone'=>'0999999999',
            'bloodType'=>'A+',
        ]);
        return $record;
    }

    private function insertBloodUnit($donor):Unit{
        $currentDate  = Carbon::now();
        $currentDateFormated  = $currentDate->format('Y/m/d');
        $expiredDate  = $currentDate->addMonths(3)->format('Y/m/d');
        $record =Unit::create([
            'bloodType'=>'A+',
            'type'=>'دم كامل',
            'status'=>'available',
            'donationDate'=>$currentDateFormated,
            'expiredDate'=>$expiredDate,
            'donor_id'=>$donor->id
        ]);
        return $record;

    }
    private function insertExport():Export{



        $export = Export::create([
            'exportDate'=>Carbon::now()->format('Y/m/d'),
            'destenation'=>'To RHMA hospital',
            'bloodType'=>'A+',
            'QYT'=>3
        ]);

        return $export;

    }

    private function insertExportwithBloodUnits($export){
        $items = Unit::where('bloodType','A+')->where('status','available')->limit(3)->get();

        if(count($items) < 3){
            throw new Exception('no items available');
        }


        foreach($items as $item){
            ExportUnit::create([
                'export_id'=>$export->id,
                'unit_id'=>$item->id
            ]);
            $item->update(['status'=>'used']);
            $this->assertEquals($item->status,'used','Blood Unit Status became used');
        }
    }

    public function test_insert_export_blood(): void
    {

        $donor = $this->insertDonor();
        $unit1 = $this->insertBloodUnit($donor);
        $unit2 = $this->insertBloodUnit($donor);
        $unit3 = $this->insertBloodUnit($donor);
        $export = $this->insertExport();
        $this->insertExportwithBloodUnits($export);


    }
    public function test_throw_excption_while_insert_export_for_lower_count_of_blood_units(){
        $this->expectException(Exception::class);
        $donor = $this->insertDonor();
        $unit1 = $this->insertBloodUnit($donor);
        $export = $this->insertExport();
        $this->insertExportwithBloodUnits($export);
    }

    public function test_delete_item_form_export(){
        $donor = $this->insertDonor();
        $unit1 = $this->insertBloodUnit($donor);
        $unit2 = $this->insertBloodUnit($donor);
        $unit3 = $this->insertBloodUnit($donor);
        $export = $this->insertExport();
        $this->insertExportwithBloodUnits($export);

        $item = ExportUnit::where('unit_id',$unit1->id)->where('export_id',$export->id)->first();
        $item->delete();

        $this->assertDatabaseMissing('export_units',['id'=>$item->id]);
    }



}
