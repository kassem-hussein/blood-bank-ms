<?php

namespace App\Http\Requests\AUTH;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
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
            'old_password'=>'required|min:8|string',
            'new_password'=>'required|string|confirmed|min:8'
        ];

    }
    public function messages()
    {
        return [
                'old_password' => [
                    'required' => 'الرجاء إدخال كلمة المرور القديمة.',
                    'min' => 'يجب أن تحتوي كلمة المرور القديمة على 8 أحرف على الأقل.',
                    'string' => 'يجب أن تكون كلمة المرور القديمة عبارة عن نص.',
                ],
                'new_password' => [
                    'required' => 'الرجاء إدخال كلمة المرور الجديدة.',
                    'string' => 'يجب أن تكون كلمة المرور الجديدة عبارة عن نص.',
                    'confirmed' => 'تأكيد كلمة المرور الجديدة غير مطابق.',
                    'min' => 'يجب أن تحتوي كلمة المرور الجديدة على 8 أحرف على الأقل.',
                ],
                ];

    }

}
