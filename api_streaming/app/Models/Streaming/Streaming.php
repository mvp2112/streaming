<?php

namespace App\Models\Streaming;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Streaming extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "title",
        "slug",
        "imagen",
        "subtitle",
        "description",
        "genre_id",
        "vimeo_id",
        "time",
        "tags",
        "state",
        "type",

        "vimeo_contenido_id",
        "time_contenido",
    ];

    function setCreatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["created_at"]= Carbon::now();
    }

    function setUpdatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["updated_at"]= Carbon::now();
    }

    function genre(){
        return $this->belongsTo(Genre::class);
    }

    function actors(){
        return $this->hasMany(StreamingActor::class);
    }

    function seasons(){
        return $this->hasMany(StreamingSeason::class);
    }

    function getTags(){
        $tags = explode(",",$this->tags);
        $tags_model = Tag::whereIn("title",$tags)->get();
        return $tags_model;
    }

    function scopefilterStreamings($query,$search,$state){
        if($state){
            $query->where("state",$state);
        }
        if($search){
            $query->where("title","like","%".$search."%");
        }
        return $query;
    }
}
