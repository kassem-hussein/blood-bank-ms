<?php

namespace App\Http\Requests\AUTH;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username'=>'required|string',
            'password'=>'required|string',
        ];

    }

    public function messages()
    {
        return [
            'username.required' => 'اسم المستخدم مطلوب.',
            'username.string' => 'يجب أن يكون اسم المستخدم نصاً.',
            'password.required' => 'كلمة المرور مطلوبة.',
            'password.string' => 'يجب أن تكون كلمة المرور نصاً.',
        ];
    }
}
