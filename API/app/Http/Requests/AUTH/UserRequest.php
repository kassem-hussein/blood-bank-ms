<?php

namespace App\Http\Requests\AUTH;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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

        $userID = request()->route('user');
        if(request()->method  == 'POST'){
            return [
                'name'=>'required|string',
                'username'=>'required|string|unique:users,username',
                'password'=>'string|required|min:8|confirmed',
                'role'=>'required|in:admin,user,doctor'
            ];
        }
        return [
            'name'=>'string',
            'username'=> [
                'string',
                Rule::unique('users', 'username')->ignore($userID)
            ],
            'role'=>'in:admin,user,doctor'
        ];

    }

    public function messages()
    {
        return [
               'name.required' => 'الرجاء إدخال الاسم.',
                'name.string' => 'يجب أن يكون الاسم عبارة عن نص.',
                'username.required' => 'الرجاء إدخال اسم المستخدم.',
                'username.string' => 'يجب أن يكون اسم المستخدم عبارة عن نص.',
                'username.unique' => 'اسم المستخدم مستخدم بالفعل.',
                'password.required' => 'الرجاء إدخال كلمة المرور.',
                'password.string' => 'يجب أن تكون كلمة المرور عبارة عن نص.',
                'password.min' => 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.',
                'password.confirmed'=>'يجب تأكيد كلمة المرور في حقل password_confirmation',
                'role.required' => 'الرجاء تحديد الدور.',
                'role.in' => 'الدور يجب أن يكون أحد القيم التالية: admin, doctor,user .',
        ];
    }
}
