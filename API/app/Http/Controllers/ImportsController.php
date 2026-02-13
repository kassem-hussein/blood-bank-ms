<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportRequest;
use App\Models\Import;
use App\Models\Unit;
use App\Utils\QueryChecker;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use PDOException;

class ImportsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{

            $total_of_imports = Import::count();
            $month_imports = DB::table('imports')
            ->whereMonth('created_at',Carbon::now()->month)
            ->count();
            $year_imports  = DB::table('imports')
            ->whereYear('created_at',Carbon::now()->year)
            ->count();

            $queryBuilder = Import::with('units');
            $date         = request()->query('date',null);
            $perpage      = request()->query('perpage',5);
            $limit        = request()->query('limit',null);
            $queryChecker = new QueryChecker();
            if($date and $queryChecker->isValidDate($date)){
                $queryBuilder = $queryBuilder->where('importDate',$date);
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
                'data'   =>$queryBuilder,
                'statistics'=>[
                    'imports'=>$total_of_imports,
                    'month_imports'=>$month_imports,
                    'year_imports'=>$year_imports
                ]
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
    public function store(ImportRequest $request)
    {
        try{
            //TODO : CREATE NEW IMPORT
            $import = Import::create($request->except('items'));
            $items = $request->items;
            if($request->items){
                // TODO : ADD BLOOD UNIT
                foreach($items as $item){
                    Unit::create([...$item,'status'=>'available','import_id'=>$import->id]);
                }
            }

            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية اضافة التوريد بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية اضافة التوريد الرجاء المحاولة لاحقاً'
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Import $import)
    {
        try{
            $item = $import->with('units')->where('imports.id',$import->id)->first();
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
    public function update(ImportRequest $request, Import $import)
    {
        try{
            $import->update($request->all());
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية تحديث التوريد بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تحديث التوريد الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Import $import)
    {
        try{
            $units = $import->units()->get();
            foreach($units as $unit){
                if($unit->status == 'used'){
                    return response()->json([
                        'success'=>false,
                        'message'=>'لا يمكن حذف هذا التوريد لانه يحوي على وحدات دموية مستخدمة'
                    ]);
                }
            }
            $import->delete();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية حذف التوريد بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية حذف توريد الرجاء المحاولة لاحقاً'
            ]);
        }
    }
}
