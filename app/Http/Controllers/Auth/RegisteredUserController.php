<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            Customer::create([
                'name'    => $request->name,
                'no_telp' => $this->generateCustomerPhoneNumber(),
                'address' => 'Pendaftaran customer',
            ]);

            if (Role::where('name', 'customer')->exists()) {
                $user->assignRole('customer');
            } elseif (Role::where('name', 'user')->exists()) {
                $user->assignRole('user');
            } elseif (Role::where('name', 'cashier')->exists()) {
                $user->assignRole('cashier');
            }

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        if ($user->hasPermissionTo('products-access')) {
            return redirect(route('products.index', absolute: false));
        }

        if ($user->hasPermissionTo('transactions-access')) {
            return redirect(route('transactions.index', absolute: false));
        }

        return redirect(route('dashboard', absolute: false));
    }

    private function generateCustomerPhoneNumber(): int
    {
        do {
            $number = (int) ('62' . now()->format('ymdHis') . random_int(10, 99));
        } while (Customer::where('no_telp', $number)->exists());

        return $number;
    }
}
