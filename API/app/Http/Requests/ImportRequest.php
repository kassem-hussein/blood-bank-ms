<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportRequest extends FormRequest
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
                    'importDate'=>  'nullable|date',
                    'source'    =>  'required|string',
                    'items'     =>  'nullable|array',
                    'items.*.bloodType'    => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
                    'items.*.type'         => 'required|string',
                    'items.*.volume'       => 'nullable|integer',
                    'items.*.donationDate' => 'required|date|date_format:Y-m-d',
                    'items.*.expiredDate'  => 'required|date|date_format:Y-m-d',
                ];
            }

            return [
                'importDate'=>  'nullable|date',
                'source'    =>  'string',
            ];

    }
    public function messages()
    {
        return [
            'sometimes' => 'يتم التحقق من هذا الحقل فقط إذا تم إرساله',
            'date_format' => 'يجب أن يكون الحقل :attribute بالتنسيق سنة-شهر-يوم (مثال: 2025-08-19).',
            'importDate.date' => 'يجب أن يكون تاريخ الاستيراد بصيغة تاريخ صحيحة.',
            'source.required' => 'حقل المصدر مطلوب.',
            'source.string'   => 'يجب أن يكون المصدر عبارة عن نص.',
            'items.array'     => 'يجب أن تكون العناصر عبارة عن مصفوفة.',
            'items.*.bloodType.required' => 'يجب تحديد فصيلة الدم لكل عنصر.',
            'items.*.bloodType.in'       => 'فصيلة الدم يجب أن تكون واحدة من القيم التالية: A+, A-, B+, B-, AB+, AB-, O+, O-.',
            'items.*.type.required' => 'يجب تحديد نوع العنصر.',
            'items.*.type.string'   => 'يجب أن يكون النوع عبارة عن نص.',
            'items.*.volume.integer' => 'يجب أن تكون الكمية رقمًا صحيحًا.',
            'items.*.donationDate.required' => 'يجب تحديد تاريخ التبرع لكل عنصر.',
            'items.*.donationDate.date'     => 'تاريخ التبرع يجب أن يكون بصيغة تاريخ صحيحة.',
            'items.*.expiredDate.required' => 'يجب تحديد تاريخ الانتهاء لكل عنصر.',
            'items.*.expiredDate.date'     => 'تاريخ الانتهاء يجب أن يكون بصيغة تاريخ صحيحة.',
        ];
    }
}
