<?php

namespace App\Http\Controllers;

use App\Http\Requests\TestRequest;
use App\Models\Test;
use App\Models\Unit;
use App\Utils\BooleanHelper;
use App\Utils\QueryChecker;
use PDOException;

class TestsContoller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try{

            $normal_tests = Test::where("HIV",0)
            ->where('hepatitis_B',0)
            ->where('hepatitis_C',0)
            ->where('syphilis',0)
            ->where('malaria',0)
            ->count();
            $total_tests  =Test::count();
            $checker      =  new QueryChecker();
            $queryBuilder = Test::with('unit');
            $testing_date = request()->query('date',null);
            $hiv          = request()->query('hiv',null);
            $hepatitis_B  = request()->query('hepatitis_B',null);
            $hepatitis_C  = request()->query('hepatitis_C',null);
            $syphilis     = request()->query('syphilis',null);
            $malaria      = request()->query('malaria',null);
            $perpage      = request()->query('perpage',5);
            $limit      = request()->query('limit',null);

            if($hiv){
                $hiv          = filter_var($hiv,FILTER_VALIDATE_BOOLEAN);
                $queryBuilder = $queryBuilder->where("HIV",$hiv);
            }
            if($hepatitis_B){
                $hepatitis_B   = filter_var($hepatitis_B,FILTER_VALIDATE_BOOLEAN);
                $queryBuilder = $queryBuilder->where("hepatitis_B",$hepatitis_B);
            }
            if($hepatitis_C){
                $hepatitis_C   = filter_var($hepatitis_C,FILTER_VALIDATE_BOOLEAN);
                $queryBuilder = $queryBuilder->where("hepatitis_C",$hepatitis_C);
            }
            if($syphilis){
                $syphilis   = filter_var($syphilis,FILTER_VALIDATE_BOOLEAN);
                $queryBuilder = $queryBuilder->where("syphilis",$syphilis);
            }
            if($malaria){
                $malaria   = filter_var($malaria,FILTER_VALIDATE_BOOLEAN);
                $queryBuilder = $queryBuilder->where("malaria",$malaria);
            }
            if($testing_date && $checker->isValidDate($testing_date)){
                $queryBuilder = $queryBuilder->where("testDate",$testing_date);
            }
            if ($limit && $checker->isValidInteger($limit)) {
                $queryBuilder = $queryBuilder->limit($limit)->get();
            } elseif ($perpage && $checker->isValidInteger($perpage)) {
                $queryBuilder = $queryBuilder->paginate($perpage)->withQueryString();
            } else {
                $queryBuilder = $queryBuilder->paginate(5)->withQueryString();
            }
            return response()->json([
                'success'=>true,
                'data'=>$queryBuilder,
                'statistics'=>[
                    'tests'=>$total_tests,
                    'normal_tests'=>$normal_tests,
                    'denormal_tests'=>$total_tests - $normal_tests
                ]
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية جلب البيانات الرجاء المحاولة لاحقاً',
                'exception'=>$ex->getMessage()
            ]);
        }


    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TestRequest $request)
    {
        try{
            //TODO : CHECK UNIT STATUS IS TESTING TO CONTNUE
            $unit = Unit::find($request->unit_id);
            if($unit->status != 'testing'){
                return response()->json([
                    'success'=>false,
                    'message'=>'عذراً هذه الوحدة الدموية خاضعة للفحص سابقاً'
                ]);
            }


            $data = Test::create($request->all());
            $tests = [
                $request->HIV,
                $request->hepatitis_B,
                $request->hepatitis_C,
                $request->syphilis,
                $request->malaria
            ];

            $booleanHelper = new BooleanHelper();
            if(!$booleanHelper->allOf(false,...$tests)){
                $data->unit->update([
                    'status'=>'invalid'
                ]);
                $data->unit->donor->update([
                    'qualified'=>0
                ]);
            }else{
                $data->unit->update([
                    'status'=>'available'
                ]);
                $data->unit->donor->update([
                    'qualified'=>1
                ]);
            }

            return response()->json([
                'success'=>true,
                'message'=>'تمت علمية اضافة الفحص للوحدة الدموية',
                'data'=>$data->with('unit')->first()
            ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية اضافة تحليل للوحدة الدموية'
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Test $test)
    {
        try{

            $item = Test::with('unit')->where('tests.id',$test->id)->first();
            return response()->json([
                'success'=>true,
                'data'   =>$item
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية جلب البيانات الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TestRequest $request, Test $test)
    {
        try{
            //TODO : CEHCK IF NEW UNIT DON'T EQUAL TO OLD UNIT
            if($request->unit_id and ($request->unit_id != $test->unit_id)){
                // TODO : check NEW UNIT STATUS
                $item  = Unit::find($request->unit_id);
                if($item->status != 'testing'){
                    return response()->json([
                        'success'=>false,
                        'message'=>'عذراً هذه الوحدة الدموية خاضعة للفحص سابقاً'
                    ]);
                }

                // TODO :  RESET OLD UNIT STATUS
                $test->unit->update([
                    'status'=>'testing'
                ]);
            }
            // TODO :CHECK TESTINGS RESULT
            $test->update($request->all());
            $tests = [
                $test->HIV,
                $test->hepatitis_B,
                $test->hepatitis_C,
                $test->syphilis,
                $test->malaria
            ];

            $booleanHelper = new BooleanHelper();

            if(!$booleanHelper->allOf(false,...$tests)){
                $test->unit->update([
                    'status'=>'invalid'
                ]);
                $test->unit->donor->update([
                    'qualified'=>0
                ]);
            }else{
                $test->unit->update([
                    'status'=>'available'
                ]);
                $test->unit->donor->update([
                    'qualified'=>1
                ]);
            }

            return response()->json([
                'success'=>true,
                'message'=>'تمت علمية تعديل الفحص للوحدة الدموية',
                'data'=>$test->with('unit')->first()
            ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تعديل تحليل الوحدة الدموية الرجاء المحاولة لاحقاً'
            ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test)
    {
        try{
            //TODO : REST BLOOD UNTI STATUS TO TESTING
            $test->unit->update([
                'status'=>'testing'
            ]);
            //TODO :DELTE TEST
            $test->delete();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية حذف الفحص للوحدة الدموية بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية حذف التحليل الخاص بالوحدة الدموية الرجاء المحاولة لاحقاً'
            ]);
        }
    }
}
