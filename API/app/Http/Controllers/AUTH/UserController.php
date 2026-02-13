<?php

namespace App\Http\Controllers\AUTH;

use App\Http\Controllers\Controller;
use App\Http\Requests\AUTH\UserRequest;
use App\Models\User;
use App\Utils\QueryChecker;
use PDOException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try{

            $user_role  = User::where('role','user')->count();
            $admin_role  = User::where('role','admin')->count();
            $doctor_role = User::where('role','doctor')->count();

            $queryBuilder = User::query();
            //search QUERY
            $username     = request()->query('username',null);
            $role         = request()->query('role',null);
            $perpage      = request()->query('perpage',null);
            $limit        = request()->query('limit',null);
            $sortBy       = explode(',', request()->query('sort', 'id'));
            $dir          = explode(',', request()->query('dir', 'asc'));

            if($username){
                $queryBuilder = $queryBuilder->where('username',$username);
            }
            if($role){
                $queryBuilder = $queryBuilder->where('role',$role);
            }

            $sortedBY = [
                'id',
                'name',
                'username',
                'role',
                'created_at',
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
                    'admin_users'=>$admin_role,
                    'doctor_users'=>$doctor_role,
                    'normal_users'=>$user_role
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
    public function store(UserRequest $request)
    {

        try{
            $user = User::create($request->all());
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية اضافة متسخدم بنجاح',
                'data'=>$user
            ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية اضافة مستخدم الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        try{
            return response()->json([
                'success'=>true,
                'data'=>$user
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
    public function update(UserRequest $request, User $user)
    {

        try{
            $user->update($request->all());
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية تحديث بيانات المستخدم بنجاح'
            ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تحديث معلومات المستخدم الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try{
            if($user->id == request()->user()->id){
                return response()->json([
                    'success'=>false,
                    'message'=>'لا يمكنك حذف نفسك'
                ]);
            }
            $user->delete();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية حذف المستخدم بنجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية حذف بيانات المستخدم الرجاء المحاولة لاحقاً'
            ]);
        }

    }
}
