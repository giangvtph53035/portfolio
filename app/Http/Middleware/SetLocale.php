<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Get locale from session, cookie, or default
        $locale = $request->get('locale') 
                  ?? Session::get('locale') 
                  ?? $request->cookie('locale') 
                  ?? config('app.locale');

        // Validate locale
        if (in_array($locale, config('app.supported_locales', ['en', 'vi']))) {
            App::setLocale($locale);
            Session::put('locale', $locale);
        }

        return $next($request);
    }
}