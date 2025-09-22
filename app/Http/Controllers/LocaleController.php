<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class LocaleController extends Controller
{
    public function setLocale(Request $request)
    {
        $locale = $request->input('locale');
        
        // Validate locale
        if (in_array($locale, config('app.supported_locales', ['en', 'vi']))) {
            App::setLocale($locale);
            Session::put('locale', $locale);
            
            return response()->json([
                'success' => true,
                'locale' => $locale,
                'message' => 'Language changed successfully'
            ])->cookie('locale', $locale, 60 * 24 * 365); // 1 year
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Invalid locale'
        ], 400);
    }
    
    public function getTranslations(Request $request)
    {
        $locale = App::getLocale();
        
        return response()->json([
            'locale' => $locale,
            'translations' => [
                'common' => trans('common'),
            ]
        ]);
    }
}