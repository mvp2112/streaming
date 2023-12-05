<?php

namespace App\Models\Streaming;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StreamingEpisode extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "streaming_season_id",
        "title",
        "description",
        "imagen",
        "vimeo_id",
        "time",
        "state",
    ];

    function setCreatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["created_at"]= Carbon::now();
    }

    function setUpdatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["updated_at"]= Carbon::now();
    }

    function season() {
        return $this->belongsTo(StreamingSeason::class);
    }
}
