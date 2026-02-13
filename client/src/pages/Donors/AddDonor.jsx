 import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ErrorMessage from '../../Utils/RequestMessage'
import { Breadcrumb } from '../../components'
import { BASE_URL } from '../../Constrants/Constrant'
const AddDonor = () => {
  const schema = {
      name:'',
      phone:'',
      email:'',
      bloodType:'',
      nationalityID:'',
      DOB:''
  }
  const [data,setData] = useState(schema)
  const [erorrs,setErrors] = useState(schema)
  const [saving,setSaving] = useState(false)
  const {token} = useSelector(state=>state.user);
  const navigate = useNavigate()

  const isValidData = ()=>{
      if(data.nationalityID.trim() == ''){
            setErrors({...erorrs,nationalityID:'حقل الرقم الوطني مطلوب'});
            return false;
      }
      if(data.name.trim() == ''){
            setErrors({...erorrs,name:'حقل الاسم مطلوب'});
            return false;
      }
      if(data.bloodType.trim() == ''){
            setErrors({...erorrs,bloodType:'حقل الزمرة الدموية مطلوب'});
            return false;
      }
      let bloodtypes =[
            'A+','A-','B+','B-','AB+','AB-','O+','O-'
      ];
      if(!bloodtypes.find((item=>item == data.bloodType))){
            setErrors({...erorrs,bloodType:'الزمرة الدموية يجب ان تكون من : A+,A-,B+,B-,AB+,AB-,O+,O-'});
            return false;
      }
      if(data.email.trim() == ''){
            setErrors({...erorrs,email:'حقل البريد الالكتروني مطلوب'});
            return false;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(!emailRegex.test(data.email)){
            setErrors({...erorrs,email:'حقل البريد الالكتروني يحب ان يكون حقيقي'});
            return false;
      }
      if(data.phone.trim() == ''){
            setErrors({...erorrs,phone:'حقل رقم الجوال مطلوب'});
            return false;
      }
      if(data.DOB.trim() == ''){
            setErrors({...erorrs,DOB:'حقل تاريخ الميلاد مطلوب'});
            return false;
      }
      const phonePattren = /^9\d{7}[0-9]$/;
      if(!phonePattren.test(data.phone)){
            setErrors({...erorrs,phone:'حقل الجوال يجب ان يتالف من تسعة ارقام ابتداً من 9 '});
            return false;
      }
      return true;
  }

  const handleSave = async ()=>{
      if(!isValidData()) return;
      try{
            setSaving(true)
            const response = await fetch(`${BASE_URL}/donors`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify(data)
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR)
                  
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED)
            }else if(response.status == 422){
                  setErrors({...erorrs,
                        email:resData?.errors?.email?.[0] || '',
                        phone:resData?.errors?.phone?.[0] || '',
                        nationalityID:resData?.errors?.nationalityID?.[0] || '',
                        bloodType:resData?.errors?.bloodType?.[0] || '',
                        name:resData?.errors?.name?.[0] || '',
                        DOB:resData?.errors?.DOB?.[0] || ''
                  })
            }else if(response.ok){
                  if(resData.success){
                        toast.success(resData.message)
                        navigate('/donors')
                  }else{
                        toast.error(resData.message)
                  }
            }else{
                  toast.error(ErrorMessage.ANY)
            }

      }catch(err){
            console.log(err)
            
      }finally{
            setSaving(false);
      }
  }

  return (
    <div className='p-4'>
            {/* Navigation History */}
            <Breadcrumb items={[{label:'المتبرعين',href:'/donors'},{label:'أضافة متبرع',href:'#'}]}/>

            <div className='w-full mt-10 p-6 bg-white rounded shadow'>
                  <h2 className="text-xl font-bold mb-4" > <i className='fa fa-edit text-red-400'></i> أضافة معلومات المتبرع</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                        <div className='flex flex-col gap-2'>
                              <label  for="nationalityID" required >الرقم الوطني</label>
                              <div>
                                    <input
                                    type="text"
                                    id='nationalityID'
                                    name="nationalityID"
                                    placeholder="الرقم الوطني"
                                    value={data.nationalityID}
                                    onChange={ (e)=> {setErrors({...erorrs,nationalityID:''});setData({...data,nationalityID:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />
                                    {
                                          erorrs.nationalityID.trim() != '' ?
                                          <div className='text-sm text-red-500'>{erorrs.nationalityID}</div>
                                          :''
                                    }
                              </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                              <label for="name" required>اسم المتبرع</label>
                              <div>
                                    <input
                                    type="text"
                                    name="name"
                                    id='name'
                                    placeholder="اسم المتبرع"
                                    value={data.name}
                                    onChange={(e)=>{setErrors({...erorrs,name:''});setData({...data,name:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />
                                    {
                                          erorrs.name.trim() != '' ?
                                          <div className='text-sm text-red-500'>{erorrs.name}</div>
                                          :''
                                    }
                              </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                              <label for="bloodType" required>الزمرة الدموية</label>
                              <div>
                                    
                                    <select
                                    type="text"
                                    id='bloodType'
                                    name="bloodType"
                                    placeholder="الزمرة الدموية"
                                    value={data.bloodType}
                                    onChange={(e)=>{setErrors({...erorrs,bloodType:''});setData({...data,bloodType:e.target.value})}}
                                    className="w-full  p-2 border border-gray-100 rounded"
                                    >
                                          <option value="">اختر الزمرة الدموية</option>      
                                          <option value="A+">A+</option>      
                                          <option value="A-">A-</option>      
                                          <option value="B+">B+</option>      
                                          <option value="B-">B-</option>      
                                          <option value="AB+">AB+</option>      
                                          <option value="AB-">AB-</option>      
                                          <option value="O+">O+</option>      
                                          <option value="O-">O-</option>      
                                    </select>

                                    {
                                          erorrs.bloodType.trim() != '' ?
                                          <div className='text-sm text-red-500'>{erorrs.bloodType}</div>
                                          :''
                                    }
                              </div>

                        </div>
                        <div className='flex flex-col gap-2'>
                              <label for="email" required>البريد الالكتروني</label>
                              <div>
                                    <input
                                    type="email"
                                    id='email'
                                    name="email"
                                    placeholder="البريد الالكتروني"
                                    value={data.email}
                                    onChange={(e)=>{setErrors({...erorrs,email:''});;setData({...data,email:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />
                                    {
                                          erorrs.email.trim() != ''?
                                          <div className='text-sm text-red-500'>{erorrs.email}</div>
                                          :''
                                    }
                              </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                              <label for="phone" required>الجوال</label>
                              <div>
                                          
                                    <input
                                    id='phone'
                                    type="text"
                                    name="phone"
                                    placeholder="الجوال"
                                    value={data.phone}
                                    onChange={(e)=>{setErrors({...erorrs,phone:''});setData({...data,phone:e.target.value})}}
                                    className="w-full p-2 border  border-gray-100 rounded"
                                    />
                                    {
                                          erorrs.phone.trim() != '' ?
                                          <div className='text-sm text-red-500'>{erorrs.phone}</div>
                                          :''
                                    }
                              </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                              <label for="DOB" required>تاريخ الميلاد</label>
                              <div>
                                          
                                    <input
                                    id='phone'
                                    type="date"
                                    name="DOB"
                                    placeholder="الجوال"
                                    value={data.DOB}
                                    onChange={(e)=>{setErrors({...erorrs,DOB:''});setData({...data,DOB:e.target.value})}}
                                    className="w-full p-2 border  border-gray-100 rounded"
                                    />
                                    {
                                          erorrs.DOB.trim() != '' ?
                                          <div className='text-sm text-red-500'>{erorrs.DOB}</div>
                                          :''
                                    }
                              </div>
                        </div>
                  </div>
                  <div className='flex justify-end items-center gap-2 mt-3'>
                        <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button onClick={()=>handleSave()} disabled={saving} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 bg-[#82181A] border border-[#82181A] hover:border-red-600 text-white rounded hover:bg-red-700 transition'>حفظ البيانات</button>
                  </div>
            
            </div>
    </div>
  )
}

export default AddDonor
