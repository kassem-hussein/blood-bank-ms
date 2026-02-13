<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportItemRequest;
use App\Models\Import;
use App\Models\Unit;
use App\Utils\QueryChecker;
use PDOException;

class ImportItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Import $import)
    {
        try{

            $queryBuilder = Unit::where('import_id',$import->id);
            $bloodType    = request()->query('blood',null);
            $volume       = request()->query('volume',null);
            $donationDate = request()->query('donation_date',null);
            $expiredDate  = request()->query('expired_date',null);
            $perpage      = request()->query('perpage',5);
            $limit      = request()->query('limit',null);

            if($bloodType){
                $queryBuilder = $queryBuilder->where('bloodType',$bloodType);
            }
            if($volume){
                $queryBuilder = $queryBuilder->where('volume',$volume);
            }
            if($donationDate){
                $queryBuilder = $queryBuilder->where('donationDate',$donationDate);
            }
            if($expiredDate){
                $queryBuilder = $queryBuilder->where('expiredDate',$expiredDate);
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
                'message'=>'تمت العملية بنجاح',
                'data'=>$queryBuilder
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت علمية جلب البيانات الرجاء المحاولة لاحقاً'
            ]);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ImportItemRequest $request,Import $import)
    {
        try{
            $data = $import->units()->create([...$request->all(),'status'=>'available']);
            return response()->json([
                'success'=> true,
                'message'=>'تمت عملية اضافة عنصر التوريد بنجاح',
                'data'=>$data
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية اضافة توريد الرجاء المحاولة لاحقاً'
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Import $import,Unit $unit)
    {
        try{
            if($import->id != $unit->import_id){
                return response()->json([
                    'success'=>false,
                    'message'=>'بيانات الوحدة الدموية غير متوفر لهذه التصدير'
                ],404);
            }
            return response()->json([
                'success'=>true,
                'data'=>$unit
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
    public function update(ImportItemRequest $request,Import $import,Unit $unit)
    {
        try{
            if($import->id != $unit->import_id){
               return response()->json([
                   'success'=>false,
                   'message'=>'بيانات الوحدة الدموية غير متوفر لهذه التوريد'
               ]);
           }
           $unit->update($request->all());
           return response()->json([
               'success'=>true,
               'message'=>'تمت عملية تعديل عنصر التوريد بنجاح'
           ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تعديل عنصر التوريد الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Import $import ,Unit $unit)
    {
        try{
            if($import->id != $unit->import_id){
               return response()->json([
                   'success'=>false,
                   'message'=>'بيانات الوحدة الدموية غير متوفر لهذه التوريد'
               ]);
           }
           if($unit->status == 'used') {
               return response()->json([
                   'success'=>false,
                   'message'=>'لا يمكن حذف هذه الوحدة الدموية لان تم استخدامها'
               ]);
           }
           $unit->delete();
           return response()->json([
               'success'=>true,
               'message'=>'تمت عملية حذف عنصر التوريد بنجاح'
           ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية حذف عنصر التوريد الرجاء المحاولة لاحقاً'
            ]);
        }
    }
}
