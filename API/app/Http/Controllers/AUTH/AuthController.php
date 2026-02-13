<?php

namespace App\Http\Controllers\AUTH;

use App\Http\Controllers\Controller;
use App\Http\Requests\AUTH\ChangePasswordRequest;
use App\Http\Requests\AUTH\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PDOException;

class AuthController extends Controller
{
    public function login(LoginRequest $request){
        try{

            $user = User::where('username', $request->username)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success'=>false,
                    'message'=>'اسم المستخدم او كلمة المرور غير صحيحة',
                ]);
            }
            $token = $user->createToken('api-token')->plainTextToken;
            return response()->json([
                    'success'=>true,
                    'message'=>'تمت عملية تسجيل الدخول بنجاح',
                    'token'=>$token,
                    'user'=>$user
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تسجيل الدخول الرجاء المحاولة لاحقاً'
            ]);
        }

    }

    public function logout(Request $request){
        try{
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية تسجيل خروج المستخدم بنجاح',
            ]);

        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تسجيل الخروج الرجاء المحاولة لاحقاً'
            ]);
        }
    }

    public function changePassword(ChangePasswordRequest $request){
        try{
            $user = User::where('username', $request->user()->username)->first();
            if(!$user or !Hash::check($request->old_password,$user->password)){
                return response()->json([
                    'success'=>false,
                    'message'=>'كلمة المرور القديمة المدخلة غير صحيحة'
                ]);
            }
            $user->update([
                'password'=>Hash::make($request->new_password)
            ]);
            return response()->json([
                'success'=>true,
                'message'=>'تمت عملية تغير كلمة المرور نجاح'
            ]);
        }catch(PDOException $ex){
            return response()->json([
                'success'=>false,
                'message'=>'فشلت عملية تغير كلمة المرور الرجاء المحاولة لاحقاً'
            ]);
        }

    }



}
