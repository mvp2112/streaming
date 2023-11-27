<?php

namespace App\Models\Product;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPaypal extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "type",
        "category",
        "description",
        "id_product_paypal"
    ];

    function setCreatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["created_at"]= Carbon::now();
    }

    function setUpdatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["updated_at"]= Carbon::now();
    }
}
