<?php

namespace App\Models\Plan;

use App\Models\Product\ProductPaypal;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanPaypal extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "description",
        "precio_mensual",
        "precio_anual",
        "month_free",
        "id_plan_paypal_mensual",
        "id_plan_paypal_anual",
        "id_product_paypal",
        "product_paypal_id"
    ];

    function setCreatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["created_at"]= Carbon::now();
    }

    function setUpdatedAtAttibute($value) {
        date_default_timezone_set("America/Tegucigalpa");
        $this->attributes["updated_at"]= Carbon::now();
    }

    function product_paypal(){
        return $this->belongsTo(ProductPaypal::class, "product_paypal_id");
    }
}
