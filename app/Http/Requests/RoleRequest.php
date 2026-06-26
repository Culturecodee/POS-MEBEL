<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($roleId),
            ],
            'selectedPermission' => ['nullable', 'array'],
            'selectedPermission.*' => ['exists:permissions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama akses group wajib diisi.',
            'name.unique' => 'Nama akses group sudah digunakan.',
            'selectedPermission.array' => 'Permission harus berupa array.',
            'selectedPermission.*.exists' => 'Permission yang dipilih tidak valid.',
        ];
    }
}