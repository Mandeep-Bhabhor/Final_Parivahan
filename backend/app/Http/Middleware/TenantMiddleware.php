<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $subdomain = explode('.', $host)[0];

        // Skip tenant resolution for main domain or localhost
        if ($subdomain === 'localhost' || $subdomain === '127' || !str_contains($host, '.')) {
            return $next($request);
        }

        $company = \App\Models\Company::where('subdomain', $subdomain)->first();

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        // Store company in request for use in controllers
        $request->merge(['tenant_company_id' => $company->id]);
        app()->instance('tenant', $company);

        return $next($request);
    }
}
