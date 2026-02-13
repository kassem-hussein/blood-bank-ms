<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExportUnitRequest;
use App\Models\Export;
use App\Models\Unit;
use App\Utils\QueryChecker;
use PDOException;

class ExportUnitsContoller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Export $export)
    {
        try{

            $queryBuilder   = Unit::where('export_id',$export->id);
            $unit_id        = request()->query('unit',null);
            $perpage        = request()->query('perpage',null);
            $limit        = request()->query('limit',null);
            if($unit_id){
                $queryBuilder = $queryBuilder->where('unit_id',$unit_id);
            }

            $checker = new QueryChecker();
            if ($limit && $checker->isValidInteger($limit)) {
                $queryBuilder = $queryBuilder->limit($limit)->get();
            } elseif ($perpage && $checker->isValidInteger($perpage)) {
                $queryBuilder = $queryBuilder->paginate($perpage)->withQueryString();
            } else {
                $queryBuilder = $queryBuilder->paginate(5)->withQueryString();
            }
            return response()->json([
                'success'=>true,
                'data'=> $queryBuilder
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية جلب البيانات الرجاء المحاولة لاحقاً'
            ]);
        }



    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Export $export,ExportUnitRequest $request)
    {

        // TODO: check if unit available in database
        try{
            $unit = Unit::find($request->unit_id);
            if(!$unit){
                return response()->json([
                    'success'=>false,
                    'message'=>'الوحدة الدموية غير موجودة'
                ]);
            }
            if($unit->status != 'available'){
                return response()->json([
                    'success'=>false,
                    'message'=>'عذراً لا يمكن اضافة هذه الوحدة الدموية لانها غير متوفرة للاستخدام'
                ]);
            }

            $unit->update([
                'status'=>'used',
                'export_id'=>$export->id
            ]);

            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية اضافة وحدة للتصدير بنجاح',
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية اضافة وحدة للتصدير'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Export $export,Unit $unit)
    {
        try{
            if($unit->export_id == $export->id){
                return response()->json([
                    'success'=>true,
                    'data'=>$unit
                ]);

            }
            return response()->json([
                    'success'=>false,
                    'data'=>'عذراً هذه الوحدة غير مضافة على التصدير'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية جلب البيانات الرجاء المحاولة لاحقاً'
            ]);
        }


    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Export $export , Unit $unit)
    {
        try{
            if($unit->export_id != $export->id){
                return response()->json([
                    'success'=>false,
                    'data'=>'عذراً هذه الوحدة غير مضافة على التصدير'
                ]);
            }

            $unit->update([
                'status'=>'available',
                'export_id'=>null
            ]);
            return response()->json([
                'success'=>true,
                'message'=>'تمت علية حذف عنصر التصدير بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية حذف عنصر التصدير الرجاء المحاولة لاحقاً'
            ]);
        }
    }
}
