<?php

namespace App\Http\Controllers\Streaming;

use App\Http\Controllers\Controller;
use App\Models\Plan\PlanPaypal;
use Illuminate\Http\Request;

class HomeStreamingController extends Controller
{
    function config_all() {

        $plans = PlanPaypal::orderBy("id", "desc")->get();
        return response()->json([
            "plans" => $plans->map(function ($plan) {
                return [
                    "id" => $plan->id,
                    "name" => $plan->name,
                    "product" => $plan->product_paypal,
                    "description" => $plan->description,
                    "precio_mensual" => $plan->precio_mensual,
                    "precio_anual" => $plan->precio_anual,
                    "month_free" => $plan->month_free,
                    "id_plan_paypal_mensual" => $plan->id_plan_paypal_mensual,
                    "id_plan_paypal_anual" => $plan->id_plan_paypal_anual,
                    "id_product_paypal" => $plan->id_product_paypal,
                    "product_paypal_id" => $plan->product_paypal_id,
                    "created_at" => $plan->created_at->format("Y-m-d h:i:s"),
                ];
            })
        ]);
    }
}
