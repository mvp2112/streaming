<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Admin\ProductAndPlanes\PlanPaypalController;
use App\Http\Controllers\Admin\ProductAndPlanes\ProductPaypalController;
use App\Http\Controllers\Admin\Streaming\StreamingActorController;
use App\Http\Controllers\Admin\Streaming\StreamingController;
use App\Http\Controllers\Admin\Streaming\StreamingGenresController;
use App\Http\Controllers\Admin\Streaming\StreamingTagController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\User\UsersController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login_streaming', [AuthController::class, 'login_streaming'])->name('login_streaming');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});

 // Rutas para el admin
Route::group([
    'middleware' => 'api',
], function ($router) {
    Route::resource("users",UsersController::class);
    Route::post("users/{id}",[UsersController::class,"update"]);
    Route::resource("products",ProductPaypalController::class);
    Route::resource("planes",PlanPaypalController::class);
    Route::resource("genres",StreamingGenresController::class);
    Route::post("genres/{id}",[StreamingGenresController::class,"update"]);
    Route::resource("actors",StreamingActorController::class);
    Route::post("actors/{id}",[StreamingActorController::class,"update"]);
    Route::resource("tags",StreamingTagController::class);

    Route::get("streaming/config_all",[StreamingController::class,"config_all"]);
    Route::resource("streaming",StreamingControllerr::class);
    Route::post("streaming/{id}",[StreamingActorController::class,"update"]);
});

//Route::group(["prefix" => "admin"], function($router){
//});
