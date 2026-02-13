<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;



class DonorRequest extends FormRequest
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

        $isUpdate = $this->method() === 'PUT' || $this->method() === 'PATCH';
        $donorID  = $this->route('donor.id');
        $minimumAge = 18;
        $cutoffDate = Carbon::now()->subYears($minimumAge)->format('Y-m-d');
        if(!$isUpdate){
            return [
                'name'=>'string|required',
                'nationalityID'=>'digits_between:8,12|numeric|required|unique:donors,nationalityID',
                'email'=>'email|required|unique:donors,email',
                'phone'=>'required|digits:9|unique:donors,phone',
                'bloodType'=>'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
                'lastDonation'=>'nullable|date|date_format:Y-m-d',
                'Donations'=>'nullable|integer',
                'DOB'=>"required|date|date_format:Y-m-d|before_or_equal:{$cutoffDate}",
                'qualified'=>'nullable|in:yes,no'
            ];
        }

        return [
            'name' => "string",
            'bloodType'=> "in:A+,A-,B+,B-,AB+,AB-,O+,O-",
            'nationalityID' => "digits_between:8,12|numeric|unique:donors,nationalityID,{$donorID}",
            'email' => "email|unique:donors,email,{$donorID}",
            'phone' => "digits:9|unique:donors,phone,{$donorID}",
            'lastDonation'=>'nullable|date|date_format:Y-m-d',
            'DOB'=>'date|date_format:Y-m-d|before_or_equal:{$cutoffDate}',
            'Donations'=>'nullable|integer',
            'qualified'=>'nullable|in:yes,no'
        ];


    }

    public function messages()
    {
        return [


            'date_format' => 'يجب أن يكون الحقل :attribute بالتنسيق سنة-شهر-يوم (مثال: 2025-08-19).',
            'name.required' => 'الاسم مطلوب.',
            'name.string' => 'يجب أن يكون الاسم نصاً.',
            'nationalityID.required'       => 'رقم الهوية الوطنية مطلوب ولا يمكن تركه فارغًا.',
            'nationalityID.numeric'        => 'يجب أن يحتوي رقم الهوية الوطنية على أرقام فقط.',
            'nationalityID.digits_between' => 'يجب أن يكون رقم الهوية الوطنية بين 8 و 12 رقمًا.',
            'nationalityID.unique'         => 'رقم الهوية الوطنية مستخدم مسبقًا، يرجى إدخال رقم آخر.',


            'DOB' => [
                'required' => 'حقل تاريخ الميلاد مطلوب.',
                'date' => 'يجب أن يكون تاريخ الميلاد تاريخًا صالحًا.',
                'date_format' => 'يجب أن يكون تاريخ الميلاد بالتنسيق التالي: سنة-شهر-يوم (YYYY-MM-DD).',
                'before_or_equal' => 'يجب أن يكون عمرك على الأقل 18 سنة.',
            ],
            'email.required' => 'البريد الإلكتروني مطلوب.',
            'email.email' => 'يجب إدخال بريد إلكتروني صالح.',
            'email.unique' => 'البريد الإلكتروني مستخدم بالفعل.',

            'phone.required' => 'رقم الهاتف مطلوب.',
            'phone.digits' => ' يجب أن يتكون رقم الهاتف من 9 أرقام من دون 0 في البداية.',
            'phone.unique' => 'رقم الهاتف مستخدم بالفعل.',

            'bloodType.required' => 'فصيلة الدم مطلوبة.',
            'bloodType.in' => 'فصيلة الدم غير صحيحة. يجب أن تكون إحدى القيم التالية: A+, A-, B+, B-, AB+, AB-, O+, O-.',

            'lastDonation.date' => 'تاريخ آخر تبرع يجب أن يكون تاريخاً صالحاً.',

            'Donations.integer' => 'عدد التبرعات يجب أن يكون رقماً صحيحاً.',

            'qualified.in' => 'قيمة التأهل يجب أن تكون "نعم" أو "لا".',
        ];
    }
}
