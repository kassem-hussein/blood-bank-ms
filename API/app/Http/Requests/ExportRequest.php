<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportRequest extends FormRequest
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
        if(request()->method == 'POST'){
            return [
                    'exportDate'=>'required|date|date_format:Y-m-d',
                    'destenation'=>'required|string',
                    'units'=>'nullable|array',
                    'units.*'=>'integer|exists:blood_units,id'
            ];
        }
        return [
            'exportDate'=>'date|date_format:Y-m-d',
            'destenation'=>'string',
        ];

    }

    public function messages()
    {
        return [
            'date_format' => 'يجب أن يكون الحقل :attribute بالتنسيق سنة-شهر-يوم (مثال: 2025-08-19).',
            'exportDate.required' => 'حقل تاريخ التصدير مطلوب.',
            'exportDate.date' => 'يجب أن يكون تاريخ التصدير تاريخًا صالحًا.',

            'destenation.required' => 'حقل الوجهة مطلوب.',
            'destenation.string' => 'يجب أن تكون الوجهة نصًا.',

            'units.array' => 'يجب أن تكون الوحدات في شكل مصفوفة.',
            'units.*.integer' => 'يجب أن تكون كل وحدة رقمًا صحيحًا.',
            'units.*.exists' => 'الوحدة المحددة غير موجودة في قاعدة البيانات.',

        ];

    }
}
