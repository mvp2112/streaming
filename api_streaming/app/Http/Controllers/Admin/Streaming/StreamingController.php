<?php

namespace App\Http\Controllers\Admin\Streaming;

use App\Http\Controllers\Controller;
use App\Http\Resources\Streaming\StreamingCollection;
use App\Http\Resources\Streaming\StreamingResource;
use App\Models\Streaming\Actor;
use App\Models\Streaming\Genre;
use App\Models\Streaming\Streaming;
use App\Models\Streaming\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StreamingController extends Controller
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

       $streamings = Streaming::filterStreamings($search,$state)->orderBy("id","desc")->get();

       return response()->json([
        "message" => 200,
        "streamings" => StreamingCollection::make($streamings),
       ]);
    }

    function config_all() {

        $tags = Tag::where("state",1)->orderBy("id","desc")->get();

        $actors = Actor::where("state",1)->orderBy("id","desc")->get();

        $genres = Genre::where("state",1)->orderBy("id","desc")->get();

        return response()->json([
            "tags" => $tags,
            "actors" => $actors->map(function($actor) {
                return [
                    "id" =>$actor->id,
                    "full_name" => $actor->full_name,
                    "profesion" => $actor->profesion,
                    "imagen" => env("APP_URL")."storage/".$actor->imagen,
                    "type" => $actor->type,
                    "state" => $actor->state,
                    "created_at" => $actor->created_at->format("Y-m-d h:i:s"),
                ];
            }),
            "genres" => $genres->map(function($actor) {
                return [
                    "id" =>$actor->id,
                    "title" => $actor->title,
                ];
            }),
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
        error_log(json_encode($request->all()));
        return ;
        $streaming_v = Streaming::where("title",$request->title)->first();
        if($streaming_v){
            return response()->json([
                "message" => 403,
                "message_text" => "El Streaming ya existe"
            ]);
        }

        if($request->hasFile("img")){
            $path = Storage::putFile("streaming/",$request->file("img"));
            $request->request->add(["imagen" => $path]);
        }
        //[2,3,4] -> 2,3,4
        // $request->request->add(["tags" => implode(",",$request->tags_a)])

        $request->request->add(["slug" => Str::slug($request->title)]);

        $streaming = Streaming::create($request->all());

        return response()->json([
            "message" => 200,
            "streaming" => StreamingResource::make($streaming),
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
        $streaming_v = Streaming::where("id","<>","$id")->where("title",$request->title)->first();
        if($streaming_v){
            return response()->json([
                "message" => 403,
                "message_text" => "El Streaming ya existe"
            ]);
        }

        $streaming = Streaming::findOrFail($id);

        if($request->hasFile("img")){
            if($streaming->imagen){
                Storage::delete($streaming->imagen);
            }
            $path = Storage::putFile("streaming/",$request->file("img"));
            $request->request->add(["imagen" => $path]);
        }

        $request->request->add(["slug" => Str::slug($request->title)]);

        $streaming->update($request->all());
        return response()->json([
            "message" => 200,
            "streaming" => StreamingResource::make($streaming),
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
        $streaming = Streaming::findOrFail($id);
        $streaming->delete();
        return response()->json(["message" => 200]);
    }
}
