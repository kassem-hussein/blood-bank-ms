<?php

namespace Tests\Feature;

use App\Models\Import;
use App\Models\Donor;
use App\Models\ImportUnit;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImportBloodTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    private function insertImportBloodUnits(){
        $import = Import::create([
            'importDate'=>Carbon::now()->format('Y/m/d'),
            'bloodType'=>'A+',
            'source'=>'Damasucs center Blood bank',
            'QYT'=>0
        ]);
        return $import;
    }



    private function insertBloodUnit() : Unit{
        $currentDate  = Carbon::now();
        $currentDateFormated  = $currentDate->format('Y/m/d');
        $expiredDate  = $currentDate->addMonths(3)->format('Y/m/d');
        $unit = Unit::create([
            'bloodType'=>'A+',
            'type'=>'دم كامل',
            'status'=>'available',
            'donationDate'=>$currentDateFormated,
            'expiredDate'=>$expiredDate,

        ]);
        return $unit;
    }


    public function insertImportUnit(Import $import,Unit $unit){
        ImportUnit::create([
            'unit_id'=>$unit->id,
            'import_id'=>$import->id
        ]);
        $import->update([
            'QYT'=>$import->QYT + 1
        ]);
    }
    public function test_insert_import(): void
    {
       $item = $this->insertImportBloodUnits();
       $this->assertDatabaseHas('imports',['id'=>$item->id]);
    }

    public function test_add_item_to_import(){
        $import = $this->insertImportBloodUnits();
        for($i=0 ; $i< 5;$i++){
           $item = $this->insertBloodUnit();
           $this->insertImportUnit($import,$item);
        }
        $items =ImportUnit::where('import_id',$import->id)->get();

        $this->assertEquals(count($items),5);
        $this->assertEquals($import->QYT,5);
    }

    public function test_delete_unit_form_import(){
        $import = $this->insertImportBloodUnits();
        $item1 = $this->insertBloodUnit();
        $this->insertImportUnit($import,$item1);
        $item2 = $this->insertBloodUnit();
        $this->insertImportUnit($import,$item2);

        $item2->delete();
        $import->update([
            'QYT'=>$import->QYT -1
        ]);

        $items =ImportUnit::where('import_id',$import->id)->get();

        $this->assertEquals(count($items),1);
        $this->assertEquals($import->QYT,1);
    }

    public function test_delete_import(){
        $import = $this->insertImportBloodUnits();

        $item1 = $this->insertBloodUnit();
        $this->insertImportUnit($import,$item1);
        $item2 = $this->insertBloodUnit();
        $this->insertImportUnit($import,$item2);

        $id = $import->id;
        $import->delete();
        $items =ImportUnit::where('import_id',$id)->get();
        $this->assertEquals(count($items),0);
        $this->assertDatabaseMissing('imports',['id'=>$id]);

    }







}
