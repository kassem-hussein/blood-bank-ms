<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestRequest extends FormRequest
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
                'unit_id'=>'required|exists:blood_units,id',
                'HIV'=>'required|boolean',
                'hepatitis_B'=>'required|boolean',
                'hepatitis_C'=>'required|boolean',
                'syphilis'=>'required|boolean',
                'malaria'=>'required|boolean',
                'testDate'=>'date|nullable|date_format:Y-m-d'
            ];
        }
        return [
            'unit_id'=>'exists:blood_units,id',
            'HIV'=>'boolean',
            'hepatitis_B'=>'boolean',
            'hepatitis_C'=>'boolean',
            'syphilis'=>'boolean',
            'malaria'=>'boolean',
            'testDate'=>'date|nullable|date_format:Y-m-d'
        ];
    }

    public function messages()
    {
        return [
            'date_format' => 'يجب أن يكون الحقل :attribute بالتنسيق سنة-شهر-يوم (مثال: 2025-08-19).',
            'unit_id.required' => 'رقم وحدة الدم مطلوب.',
            'unit_id.exists' => 'رقم وحدة الدم غير موجود في قاعدة البيانات.',
            'HIV.required' => 'نتيجة اختبار فيروس HIV مطلوبة.',
            'HIV.boolean' => 'نتيجة اختبار فيروس HIV يجب أن تكون صحيحة أو خاطئة فقط.',

            'hepatitis_B.required' => 'نتيجة اختبار التهاب الكبد B مطلوبة.',
            'hepatitis_B.boolean' => 'نتيجة اختبار التهاب الكبد B يجب أن تكون صحيحة أو خاطئة فقط.',

            'hepatitis_C.required' => 'نتيجة اختبار التهاب الكبد C مطلوبة.',
            'hepatitis_C.boolean' => 'نتيجة اختبار التهاب الكبد C يجب أن تكون صحيحة أو خاطئة فقط.',

            'syphilis.required' => 'نتيجة اختبار الزهري مطلوبة.',
            'syphilis.boolean' => 'نتيجة اختبار الزهري يجب أن تكون صحيحة أو خاطئة فقط.',

            'malaria.required' => 'نتيجة اختبار الملاريا مطلوبة.',
            'malaria.boolean' => 'نتيجة اختبار الملاريا يجب أن تكون صحيحة أو خاطئة فقط.',

            'testDate.date' => 'تاريخ الفحص يجب أن يكون تاريخاً صالحاً.',
        ];

    }
}
