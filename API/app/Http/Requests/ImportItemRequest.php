<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportItemRequest extends FormRequest
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
                'bloodType'    => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
                'type'         => 'required|string',
                'volume'       => 'nullable|integer',
                'donationDate' => 'required|date|date_format:Y-m-d',
                'expiredDate'  => 'required|date|date_format:Y-m-d',
            ];
        }
        return [
            'bloodType'    => 'in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'type'         => 'string',
            'volume'       => 'integer',
            'donationDate' => 'date|date_format:Y-m-d',
            'expiredDate'  => 'date|date_format:Y-m-d',
        ];
    }

    public function messages()
    {
        return [
            'date_format' => 'يجب أن يكون الحقل :attribute بالتنسيق سنة-شهر-يوم (مثال: 2025-08-19).',
            'bloodType.required' => 'يجب تحديد فصيلة الدم لكل عنصر.',
            'bloodType.in'       => 'فصيلة الدم يجب أن تكون واحدة من القيم التالية: A+, A-, B+, B-, AB+, AB-, O+, O-.',
            'type.required' => 'يجب تحديد نوع العنصر.',
            'type.string'   => 'يجب أن يكون النوع عبارة عن نص.',
            'volume.integer' => 'يجب أن تكون الكمية رقمًا صحيحًا.',
            'donationDate.required' => 'يجب تحديد تاريخ التبرع لكل عنصر.',
            'donationDate.date'     => 'تاريخ التبرع يجب أن يكون بصيغة تاريخ صحيحة.',
            'expiredDate.required' => 'يجب تحديد تاريخ الانتهاء لكل عنصر.',
            'expiredDate.date'     => 'تاريخ الانتهاء يجب أن يكون بصيغة تاريخ صحيحة.',
        ];
    }
}
