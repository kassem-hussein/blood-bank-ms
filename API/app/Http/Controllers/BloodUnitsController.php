<?php

namespace App\Http\Controllers;

use App\Http\Requests\BloodUnitRequest;
use App\Models\Donor;
use App\Models\Unit;
use App\Utils\QueryChecker;
use Carbon\Carbon;
use PDOException;

class BloodUnitsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try{

            $units_count = Unit::count();
            $available_units = Unit::where('status','available')->count();
            $expired_units = Unit::where('status','expired')->count();

            $queryBuilder = Unit::with(['donor' => function($q){
                $q->select('id','name');
            }]);
            $bloodType    = request()->query('blood',null);
            $id    = request()->query('id',null);
            $volume       = request()->query('volume',null);
            $donationDate = request()->query('donation_date',null);
            $expiredDate  = request()->query('expired_date',null);
            $sortBy       = explode(',', request()->query('sort', 'id'));
            $dir          = explode(',', request()->query('dir', 'asc'));
            $perpage      = request()->query('perpage',5);
            $limit      = request()->query('limit',null);

            if($id){
                $queryBuilder = $queryBuilder->where('id',$id);
            }
            if($bloodType){
                $queryBuilder = $queryBuilder->where('bloodType',$bloodType);
            }
            if($volume){
                $queryBuilder = $queryBuilder->where('volume',$volume);
            }
            $checker = new QueryChecker();

            if($donationDate and $checker->isValidDate($donationDate)){
                $queryBuilder = $queryBuilder->where('donationDate',$donationDate);
            }
            if($expiredDate and $checker->isValidDate($expiredDate)){
                $queryBuilder = $queryBuilder->where('expiredDate',$expiredDate);
            }

            $sortedBY = [
                'volume',
                'type',
                'bloodType',
                'donationDate',
                'expiredDate',
                'id',
            ];

            foreach ($sortBy as $index => $column) {
                $direction = $dir[$index] ?? 'asc'; // fallback to 'asc' if not enough directions
                if (in_array($column, $sortedBY) && in_array($direction, ['asc', 'desc'])) {
                    $queryBuilder->orderBy($column, $direction);
                }
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
                'message'=>'تمت العملية بنجاح',
                'data'=>$queryBuilder,
                'statstics'=>[
                    'expired_units'=>$expired_units,
                    'available_units'=>$available_units,
                    'units'=>$units_count
                ]
            ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت علمية جلب البيانات الرجاء المعاودة لاحقاً'
            ]);
        }




    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BloodUnitRequest $request)
    {
        try{

             $donor = Donor::find($request->donor_id);
            if(!$donor){
                return response()->json([
                    'success'=>false,
                    'message'=>'عذراً بيانات المتبرع غيرة متوفرة لدينا'
                ]);
            }
            if(!$donor->qualified){
                    return response()->json([
                        'success'=>false,
                        'message'=>'هذا المتبرع غير مؤهل للتبرع'
                    ]);
            }
            $item =  Unit::create([...$request->all(),'bloodType'=>$donor->bloodType]);
            $donor->update([
                'lastDonation' =>Carbon::now()->format('Y-m-d'),
                'donations'    => ($donor->donations || 0) + 1
            ]);
            return response()->json([
                    'success'=>true,
                    'message'=>'تمت عملية اضافة تبرع بنجاح',
                    'data'=>$item
            ]);
        }catch(PDOException $ex){
            return response()->json([
                    'success'=>false,
                    'message'=>'فشلت عملية اضافة تبرع الرجاء المعاودة لاحقاً'
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        try{
            $item = $unit->with(['donor'=>function($q){
                $q->select('id','name');
                }])->where('blood_units.id',$unit->id)->first();
            return response()->json([
                'success'=>true,
                'data'=>$item
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'حدثت مشكلة اثناء جلب البيانات'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BloodUnitRequest $request, Unit $unit)
    {
        try{
            $unit->update([...$request->all()]);
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية  تعديل التبرع بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'حدثت مشكلة اثناء عملية التعديل'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        try{
            $unit->delete();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية حذف التبرع بنجاح'
            ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>"حذثت مشكلة انئاء عملية الحذف"
            ]);
        }

    }


}
