import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const AddTest = () => {
 const [data,setData]= useState({
      unit_id :'',
      HIV :false,
      hepatitis_B:false,
      hepatitis_C:false,
      syphilis:false,
      malaria:false
 })
 const [loading,setLoading] = useState(false);
 const navigate             = useNavigate();
 const {token} = useSelector(state=>state.user);
 const [errors,setErrors] = useState({
      unit_id :'',
      HIV :'',
      hepatitis_B:'',
      hepatitis_C:'',
      syphilis:'',
      malaria:''
 })

 const checkInputData = ()=>{
      if(data.unit_id == ''){
            setErrors({...errors,unit_id:'يجب ادخال معرف الوحدة الدموية الازمة للاتمام الاختبار'})
            return false;
      }
      if(data.HIV === ''){
            setErrors({...errors,HIV:'يرجى اختيار نتجة الاختبار سلبي او ايجابي '})
            return false;
      }
      if(data.hepatitis_B === ''){
            setErrors({...errors,hepatitis_B:'يرجى اختيار نتجة الاختبار سلبي او ايجابي '})
            return false;
      }
      if(data.hepatitis_C === ''){
            setErrors({...errors,hepatitis_C:'يرجى اختيار نتجة الاختبار سلبي او ايجابي '})
            return false;
      }
      if(data.syphilis === ''){
            setErrors({...errors,syphilis:'يرجى اختيار نتجة الاختبار سلبي او ايجابي '})
            return false;
      }
      if(data.malaria === ''){
            setErrors({...errors,malaria:'يرجى اختيار نتجة الاختبار سلبي او ايجابي '})
            return false;
      }
      return true;
 }
 const handleSave= async()=>{

      if(!checkInputData()) return;
      try{
            setLoading(true);
            const response = await fetch(`${BASE_URL}/tests`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify(data)
            })

            const resData = await response.json();
            if(response.status == 500){
                  toast.error('حدثت مشكلة في السيرفر الرجاء اعادة المحاولة')
            }else if(response.status == 403 || response.status == 401){
                  toast.error('انت غير مخول للقيام في هذه العملية')
            }else if(response.status == 422){
                  toast.error('البيانات المدخلة غير صحيحة تحقق من صحة البيانات واهد المحاولة من جديد')
                  setErrors({...errors,
                        unit_id:resData.errors?.unit_id?.[0] || '',
                        HIV:resData.errors?.HIV?.[0] || '',
                        hepatitis_B:resData.errors?.hepatitis_B?.[0] || '',
                        hepatitis_C:resData.errors?.hepatitis_C?.[0] || '',
                        syphilis:resData.errors?.syphilis?.[0] || '',
                        malaria:resData.errors?.malaria?.[0] || '',
                  })

            }else if(response.ok){
                  if(!resData.success){
                        toast.error(resData.message)
                  }
                  else{
                        toast.success(resData.message)
                        navigate('/tests')
                  }
            }
      }catch(err){
            console.log(err)
      }finally{
            setLoading(false);
      }
 }


  return (
    <div className='p-4'>
            {/* history */}
            <Breadcrumb items={[{label:'التحاليل الدموية  (المختبر)',href:'/tests'},{label:'اضافة  أختبار الوحدة الدموية',href:'#'}]}/>


            <div className='bg-white px-8 py-4 my-8 rounded shadow-md border-t border-gray-50'>
                  <h2 className="text-xl font-bold my-4 " > <i className='fa fa-edit text-red-400'></i> أضافة اختبار للوحدة الدموية</h2>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
                        <div className='flex flex-col gap-1'>
                              <label for="unit_id" required>الزمرة الدموية</label>
                              <input type="text"
                                name="unit_id"
                                id='unit_id'
                                value={data.unit_id}
                                className='w-full mb-3 p-2 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,unit_id:''}); setData({...data,unit_id:e.target.value})}}
                              />
                              {
                                    errors.unit_id != ''?
                                    <div className='text-sm text-red-500'>{errors.unit_id}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="HIV" required>اختبار نقص المناعة البشرية (HIV)</label>
                              <select 
                                name="HIV"
                                id='HIV'
                                className='w-full mb-3 p-1 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,HIV:''}); setData({...data,HIV:e.target.value})}}
                              >
                                    <option value={0}>سلبي</option>
                                    <option value={1}>ايجابي</option>
                              </select>
                              {
                                    errors.HIV != ''?
                                    <div className='text-sm text-red-500'>{errors.HIV}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="hepatitis_B" required>اختبار نقص التهاب الكبد (hepatitis_B)</label>
                              <select 
                                name="hepatitis_B"
                                id='hepatitis_B'
                                className='w-full mb-3 p-1 border border-gray-100 rounded '
                                onChange={(e)=>{setErrors({...errors,hepatitis_B:''}); setData({...data,hepatitis_B:e.target.value})}}
                              >
                                    <option value={0}>سلبي</option>
                                    <option value={1}>ايجابي</option>
                              </select>
                              {
                                    errors.hepatitis_B != ''?
                                    <div className='text-sm text-red-500'>{errors.hepatitis_B}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="hepatitis_C" required>اختبار نقص التهاب الكبد (hepatitis_C)</label>
                              <select 
                                name="hepatitis_C"
                                id='hepatitis_C'
                                className='w-full mb-3 p-1 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,hepatitis_C:''}); setData({...data,hepatitis_C:e.target.value})}}
                              >
                                    <option value={0}>سلبي</option>
                                    <option value={1}>ايجابي</option>
                              </select>
                              {
                                    errors.hepatitis_C != ''?
                                    <div className='text-sm text-red-500'>{errors.hepatitis_C}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="syphilis" required>اختبار الزُهري    (syphilis)</label>
                              <select 
                                name="syphilis"
                                id='syphilis'
                                className='w-full mb-3 p-1 border border-gray-100 rounded '
                                onChange={(e)=>{setErrors({...errors,syphilis:''}); setData({...data,syphilis:e.target.value})}}
                              >
                                    <option value={0}>سلبي</option>
                                    <option value={1}>ايجابي</option>
                              </select>
                              {
                                    errors.syphilis != ''?
                                    <div className='text-sm text-red-500'>{errors.syphilis}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="malaria" required>اختبار الملايا    (malaria)</label>
                              <select 
                                name="malaria"
                                id='malaria'
                                className='w-full mb-3 p-1 border border-gray-100 rounded '
                                onChange={(e)=>{setErrors({...errors,malaria:''}); setData({...data,malaria:e.target.value})}}
                              >
                                    <option value={0}>سلبي</option>
                                    <option value={1}>ايجابي</option>
                              </select>
                              {
                                    errors.malaria != ''?
                                    <div className='text-sm text-red-500'>{errors.malaria}</div> :'' 
                              }
                        </div>
                  </div>
                  <div className='flex justify-end item-center my-4 gap-2 '>
                        <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button onClick={handleSave} disabled={loading}  type="button" className='p-2 bg-[#82181A] text-white rounded  disabled:bg-gray-300 hover:bg-red-800'>حفظ البيانات</button>
                  </div>
            </div>
    </div>
  )
}

export default AddTest
