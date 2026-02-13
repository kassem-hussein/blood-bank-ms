<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportUnitRequest extends FormRequest
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
            'unit_id'=>'required|exists:blood_units,id'
        ];

    }

    public function messages()
    {
        return [
            'unit_id.required'=>'حقل معرف الوحدة الدموية مطلوب',
            'unit_id.exists'=>'يجب ان يكون رقم المعرف الوحدة الدموية متوفر في قاعدة البيانات'
        ];
    }
}
