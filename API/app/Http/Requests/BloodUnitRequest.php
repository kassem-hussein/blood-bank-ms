<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BloodUnitRequest extends FormRequest
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
                'donationDate'=>'required|date|date_format:Y-m-d',
                'type'=>'required|string',
                'expiredDate'=>'required|date|date_format:Y-m-d',
                'status'=>'nullable|in:used,available,expired,testing,invalid',
                'volume'=>'nullable|integer'
            ];
        }

        return [
                'donationDate'=>'date|date_format:Y-m-d',
                'expiredDate'=>'date|date_format:Y-m-d',
                'type'=>'string',
                'status'=>'in:used,available,expired,testing,invalid',
                'volume'=>'integer',
            ];

    }


    public function messages()
    {
        return [
            'date_format' => 'يجب أن يكون الحقل :attribute بالتنسيق سنة-شهر-يوم (مثال: 2025-08-19).',
            'donationDate.required' => 'تاريخ التبرع مطلوب.',
            'donationDate.date' => 'يجب أن يكون تاريخ التبرع تاريخًا صالحًا.',
            'expiredDate.required' => 'تاريخ الانتهاء مطلوب.',
            'expiredDate.date' => 'يجب أن يكون تاريخ الانتهاء تاريخًا صالحًا.',
            'bloodType.required' => 'فصيلة الدم مطلوبة.',
            'bloodType.in' => 'فصيلة الدم يجب أن تكون واحدة من الأنواع التالية: A+, A-, B+, B-, AB+, AB-, O+, O-.',
            'status.in' => 'الحالة يجب أن تكون واحدة من القيم التالية: مستخدم، متاح، منتهي، تحت الفحص، غير صالح.',
            'volume.integer' => 'الحجم يجب أن يكون رقمًا صحيحًا.',
            'donor_id.exists' => 'المتبرع المحدد غير موجود في قاعدة البيانات.',
            'type.required'=>'نوع كيس الدم مطلوب',
            'type.string'=>'يجب ان يكون كيس الدم نصي',

        ];
    }
}
