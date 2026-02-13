<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonorRequest;
use App\Models\Donor;
use App\Utils\QueryChecker;
use Exception;
use PDOException;

class DonorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try{
            $donated_donors = Donor::where('donations','>',0)->count();
            $non_donated_donors = Donor::where('donations',0)->count();
            $queryBuilder       =  Donor::query();
            $nationalityID      = request()->query('nationalityID',null);
            $phone              = request()->query('phone',null);
            $bloodType          = request()->query('blood',null);
            $perpage            = request()->query('perpage',5);
            $limit              = request()->query('limit',null);
            $name               = request()->query('name',null);
            if($name){
                $queryBuilder = $queryBuilder->where('name','like','%'.$name.'%');
            }
            if($nationalityID){
                $queryBuilder = $queryBuilder->where('nationalityID',$nationalityID);
            }
            if($phone){
                $queryBuilder =  $queryBuilder->where('phone',$phone);
            }
            if($bloodType){
                $queryBuilder =  $queryBuilder->where('bloodType',$bloodType);
            }
            $sortedBY = [
                'nationalityID',
                'phone',
                'bloodType',
                'donations',
                'email',
                'id',

            ];

            $sortBy = explode(',', request()->query('sort', 'id'));
            $dir = explode(',', request()->query('dir', 'asc'));

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
                'message'=>'تمت العملية بنجاح',
                'data'=>$queryBuilder,
                'statistics'=>[
                    'donors'=>$donated_donors + $non_donated_donors,
                    'donated'=>$donated_donors,
                    'non_donated'=>$non_donated_donors
                ]
           ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت علمية جلب البيانات الرجاء المعاودة لاحقاً'
            ]);

        }

        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DonorRequest $request)
    {


        try{
            $item = Donor::create($request->all());
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية اضافة متبرع بنجاح',
                'data'=>$item
            ]);
        }catch(Exception $e){
            return response()->json([
                'success'=>false,
                'message_ar'=>'حدثت مشكلة اثناء عملية اضافة متبرع الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Donor $donor)
    {
        try{
            return response()->json([
                'success'=>true,
                'data'=>$donor
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success' =>false,
                'message'=>'فشلت علمية جلب البيانات الرجاء المعاودة لاحقاً'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DonorRequest $request, Donor $donor)
    {
        try{
            $donor->update($request->all());
            return response()->json([
                'success'=>true,
                'message'=>'تمت علية تحديث بيانات المتبرع بنجاح',
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت علمية تحديث بيانات المتبرع الرجاء المعاودة لاحقاً'
            ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Donor $donor)
    {
        try{
            $donor->delete();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية حذف بيانات المتبرع  بنجاح'
            ]);
        }catch(PDOException $ex){
            if($ex->getCode() == 23000){
                return response()->json([
                    'success'=>false,
                    'message'=>'لا يمكن حذف هذا المتبرع لارتباطه بوحدات دموية'
                ]);
            }
            return response()->json([
                    'success'=>false,
                    'message'=>'حدثت مشكلة في عملية حذف المتبرع'
            ]);
        }
    }
}
