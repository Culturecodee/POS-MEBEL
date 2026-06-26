<?php

namespace App\Http\Middleware;

use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $paymentSetting = PaymentSetting::query()
            ->select('whatsapp_company_number')
            ->first();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() ? $request->user()->getPermissions() : [],
                'super' => $request->user() ? $request->user()->isSuperAdmin() : false,
                'role' => $request->user() ? $request->user()->primaryRole() : null,
                'regular' => $request->user() ? $request->user()->isRegularUser() : false,
                'customer' => $request->user() ? $request->user()->isCustomer() : false,
            ],
            'settings' => [
                'whatsapp_company_number' => $paymentSetting?->whatsapp_company_number,
            ],
        ];
    }
}
