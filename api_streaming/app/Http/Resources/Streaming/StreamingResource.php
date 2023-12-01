<?php

namespace App\Http\Resources\Streaming;

use Illuminate\Http\Resources\Json\JsonResource;

class StreamingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->resource->id,
            "title" => $this->resource->title,
            "slug" => $this->resource->slug,
            "imagen" => env("APP_URL")."storage/".$this->resource->imagen,
            "subtitle" => $this->resource->subtitle,
            "description" => $this->resource->description,
            "genre_id" => $this->resource->genre_id,
            "genre" => [
                "id" => $this->resource->genre->id,
                "title" => $this->resource->genre->title,
            ] ,
            "vimeo_id" => $this->resource->vimeo_id,
            "time" => $this->resource->time,
            "type" => $this->resource->type,
            "tags" => $this->resource->tags,
            "tags_multiples" => $this->resource->getTags(),
            "state" => $this->resource->state,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i:s"),
            "actors" => $this->resource->actors->map(function($actor){
                return [
                    "id" => $actor->id,
                    "full_name" => $actor->full_name,
                    "profesion" => $actor->profesion,
                ];
            }),
        ];
    }
}
