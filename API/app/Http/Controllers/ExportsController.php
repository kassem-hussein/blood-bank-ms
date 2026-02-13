<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExportRequest;
use App\Models\Export;
use App\Models\Unit;
use App\Utils\QueryChecker;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PDOException;

class ExportsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try{

            $total_of_exports = Export::count();
            $month_export = DB::table('exports')
            ->whereMonth('created_at',Carbon::now()->month)
            ->count();
            $year_export  = DB::table('exports')
            ->whereYear('created_at',Carbon::now()->year)
            ->count();

            $queryBuilder = Export::with('units');
            $exportDate   = request()->query('export_date',null);
            $destenation  = request()->query('destenation',null);
            $perpage      = request()->query('perpage',5);
            $limit        = request()->query('limit',null);
            $sortBy       = explode(',', request()->query('sort', 'id'));
            $dir          = explode(',', request()->query('dir', 'asc'));
            if($exportDate){
            $queryBuilder = $queryBuilder->where('exportDate',$exportDate);
            }
            if($destenation){
                $queryBuilder = $queryBuilder->where('destenation',$destenation);
            }

            $sortedBY = [
                'exportDate',
                'destenation',
            ];

            foreach ($sortBy as $index => $column) {
                $direction = $dir[$index] ?? 'asc'; // fallback to 'asc' if not enough directions
                if (in_array($column, $sortedBY) && in_array($direction, ['asc', 'desc'])) {
                    $queryBuilder->orderBy($column, $direction);
                }
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
                'data'=>$queryBuilder,
                'statistics'=>[
                    'exports'=>$total_of_exports,
                    'month_exports'=>$month_export,
                    'year_exports'=>$year_export
                ]
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
    public function store(ExportRequest $request)
    {
        try{

            DB::beginTransaction();
            $export = Export::create($request->except('units'));
            $units  = Unit::find([...$request->units]);
            foreach($units as $unit){
                if($unit->status != 'available'){
                    DB::rollBack();
                    return response()->json([
                        'success'=>false,
                        'message'=>'توجد وحدات دموية ليست جاهزة للاستخدام'
                    ]);
                }


                $unit->update(['status'=>'used','export_id'=>$export->id]);
            }

            DB::commit();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية اضافة التصدير بنجاح',
                'data'=>$export->with('units')->get()
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت علمية اضافة التصدير الرجاء المحاولة لاحقاً'
            ]);
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(Export $export)
    {
        try{
            $item = $export->with('units')->get();
            return response()->json([
                'success'=>true,
                'data'=>$item
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
    public function update(ExportRequest $request, Export $export)
    {
        try{
            $export->update($request->all());
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية تعديل التصدير بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تعديل التصدير الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Export $export)
    {
        try{
            foreach($export->units as $unit){
                $unit->update(['status'=>'available','export_id'=>null]);
            }
            $export->delete();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية حذف التصدير بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية حذف التصدير الرجاء المحاولة لاحقاً'
            ]);
        }

    }
}
