<?php

use App\Http\Controllers\AUTH\AuthController;
use App\Http\Controllers\AUTH\UserController;
use App\Http\Controllers\BloodUnitsController;
use App\Http\Controllers\DonorsController;
use App\Http\Controllers\ExportsController;
use App\Http\Controllers\ExportUnitsContoller;
use App\Http\Controllers\ImportItemsController;
use App\Http\Controllers\ImportsController;
use App\Http\Controllers\statisticsController;
use App\Http\Controllers\TestsContoller;
use App\Http\Middleware\NotDoctor;
use App\Http\Middleware\OnlyAdmin;
use App\Http\Middleware\OnlyDoctorOrAdmin;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function(){
    Route::post('auth/login',[AuthController::class,'login']);
    Route::get('/check-blood',[statisticsController::class,'checkUnit']);
});

Route::middleware('auth:sanctum')->group(function(){
    Route::controller(AuthController::class)->prefix('/auth')->group(function(){
        Route::post('/logout','logout');
        Route::post('/change-password','changePassword');
    });

    Route::controller(statisticsController::class)->prefix('/statistics')->group(function(){
        Route::get('/','index');
    });

    Route::controller(DonorsController::class)->middleware(NotDoctor::class)->prefix('/donors')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{donor}','show');
        Route::put('/{donor}','update');
        Route::delete('/{donor}','destroy');
    });

    Route::controller(BloodUnitsController::class)->middleware(NotDoctor::class)->prefix('/blood-units')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{unit}','show');
        Route::put('/{unit}','update');
        Route::delete('/{unit}','destroy');
    });

    Route::controller(ExportsController::class)->middleware(NotDoctor::class)->prefix('/exports')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{export}','show');
        Route::put('/{export}','update');
        Route::delete('/{export}','destroy');
    });

    Route::controller(ExportUnitsContoller::class)->middleware(NotDoctor::class)->prefix('/exports/{export}/items')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{unit}','show');
        Route::put('/{unit}','update');
        Route::delete('/{unit}','destroy');
    });

    Route::controller(TestsContoller::class)->middleware(OnlyDoctorOrAdmin::class)->prefix('/tests')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{test}','show');
        Route::put('/{test}','update');
        Route::delete('/{test}','destroy');
    });

    Route::controller(ImportsController::class)->middleware(NotDoctor::class)->prefix('/imports')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{import}','show');
        Route::put('/{import}','update');
        Route::delete('/{import}','destroy');
    });

    Route::controller(ImportItemsController::class)->middleware(NotDoctor::class)->prefix('/imports/{import}/items')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{unit}','show');
        Route::put('/{unit}','update');
        Route::delete('/{unit}','destroy');
    });

    Route::controller(UserController::class)->middleware(OnlyAdmin::class)->prefix('/users')->group(function(){
        Route::get('/','index');
        Route::post('/','store');
        Route::get('/{user}','show');
        Route::put('/{user}','update');
        Route::delete('/{user}','destroy');
    });

});


