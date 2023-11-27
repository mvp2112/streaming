<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UsersCollection;
use App\Http\Resources\User\UsersResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
       $search = $request->get("search");
       $state = $request->get("state");

       $users = User::filterUser($search,$state)->orderBy("id","desc")->where("type_user",1)->get();

       return response()->json([
        "message" => 200,
        "users" => UsersCollection::make($users),
       ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user_v = User::where("email",$request->email)->first();
        if($user_v){
            return response()->json([
                "message" => 403,
                "message_text" => "El usuario ya existe"
            ]);
        }

        if($request->hasFile("img")){
            $path = Storage::putFile("users",$request->file("img"));
            $request->request->add(["avatar" => $path]);
        }

        if($request->new_password){
            $request->request->add(["password" => bcrypt($request->new_password)]);
        }

        $user = User::create($request->all());

        return response()->json([
            "message" => 200,
            "user" => UsersResource::make($user),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user_v = User::where("id","<>",$id)->where("email",$request->email)->first();
        if($user_v){
            return response()->json([
                "message" => 403,
                "message_text" => "El usuario ya existe"
            ]);
        }

        $user = User::findOrFail($id);

        if($request->hasFile("img")){
            if($user->avatar){
                Storage::delete($user->avatar);
            }
            $path = Storage::putFile("users",$request->file("img"));
            $request->request->add(["avatar" => $path]);
        }

        if($request->new_password){
            $request->request->add(["password" => bcrypt($request->new_password)]);
        }

        $user->update($request->all());

        return response()->json([
            "message" => 200,
            "user" => UsersResource::make($user),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(["message" => 200]);
    }
}
