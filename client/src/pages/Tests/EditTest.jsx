/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Breadcrumb, Loader } from '../../components';
import ErrorMessage from '../../Utils/RequestMessage';
import { BASE_URL } from '../../Constrants/Constrant';

const EditTest = () => {
  const params = useParams();
  const {token} = useSelector(state=>state.user);
  const navigate = useNavigate();
  const [data,setData] =useState();
  const [errors,setErrors] = useState({
      HIV:'',
      hepatitis_B:'',
      hepatitis_C:'',
      syphilis:'',
      malaria:''
  }) 
  const [loadding,setLoadding] = useState(false);
  const [saving,setSaving] = useState(false);

   const fetchData = async()=>{
        try{
              setLoadding(true);
              const response = await fetch(`${BASE_URL}/tests/${params.id}`,{
                    headers:{
                          'Accept':'application/json',
                          'Authorization':'Bearer '+token
                    }
              })
              const resData = await response.json();
              if(response.status >= 500){
                    toast.error(ErrorMessage.SERVER_ERROR)
              }else if(response.status == 401 | response.status == 403){
                    toast.error(ErrorMessage.AUNTHORIZED)
              }else if(response .ok){
                    if(resData.success){
                          setData(resData.data)
                    }else{
                          toast.error(resData.message);
                    }
              }else{
                    toast.error(ErrorMessage.ANY)
              }
        }catch(err){
              console.log(err)
        }finally{
              setLoadding(false);
        }
    }
  
    useEffect(()=>{
        fetchData();
    },[]);

     const checkInputData = ()=>{
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

    const handleSave =async()=>{
            if(!checkInputData()) return;
            try{
                  setSaving(true);
                  const {HIV,hepatitis_B,hepatitis_C,syphilis,malaria} = data;
                  const response = await fetch(`${BASE_URL}/tests/${params.id}`,{
                        method :'POST',
                        headers:{
                              'Accept':'application/json',
                              'Content-Type':'application/json',
                              'Authorization':'Bearer '+token
                        },
                        body:JSON.stringify({
                              hepatitis_B,
                              hepatitis_C,
                              HIV,
                              syphilis,
                              malaria,
                              _method:'PUT'
                        })
                  })
                  const resData = await response.json();
                  if(response.status >= 500){
                        toast.error(ErrorMessage.SERVER_ERROR)

                  }else if(response.status == 401 || response.status == 403){
                        toast.error(ErrorMessage.AUNTHORIZED)
                  }else if(response.status == 422){
                        toast.error(ErrorMessage.DATA_ERROR)
                        setErrors({...errors,
                              HIV:resData?.errors?.HIV?.[0] || '',
                              hepatitis_B:resData?.errors?.hepatitis_B?.[0] || '',
                              hepatitis_C:resData?.errors?.hepatitis_C?.[0] || '',
                              syphilis:resData?.errors?.syphilis?.[0] || '',
                              malaria:resData?.errors?.malaria?.[0] || '',
                        })
                  }else if(response.ok){
                        if(resData.success){
                              toast.success(resData.message);
                              navigate('/tests')
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
     loadding? <Loader/> : data ? <div className='p-4'>
            {/* history */}
            <Breadcrumb items={[{label:'التحاليل الدموية  (المختبر)',href:'/tests'},{label:'تعديل أختبار الوحدة الدموية',href:'#'}]}/>
            <div className='px-4 py-8 my-4 bg-white shadow-md p-4 border-t border-gray-50 rounded mt-4'>
                  <h1 className='text-xl font-semibold mb-4'>  <i className='fa fa-edit me-2 text-red-400'></i>تعديل اختبار الوحدة الدموية  </h1>
                  <div className='grid grid-cols-1 md:grid-cols-2  gap-2 '>
                        <div  className='flex flex-col gap-1'>
                              <label>الزمرة الدموية</label>
                              <input disabled readOnly 
                                    type="text"
                                    className='w-full mb-3 p-2 border border-gray-100 rounded' 
                                    value={data?.unit_id}
                              />
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="HIV" required>اختبار نقص المناعة البشرية (HIV)</label>
                              <select 
                                name="HIV"
                                id='HIV'
                                className='w-full mb-3 p-2 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,HIV:''}); setData({...data,HIV:e.target.value})}}
                              >
                                    <option value={0} selected = {data?.HIV == 0 }>سلبي</option>
                                    <option value={1} selected = {data?.HIV == 1}  >ايجابي</option>
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
                                className='w-full mb-3 p-2 border border-gray-100 rounded '
                                onChange={(e)=>{setErrors({...errors,hepatitis_B:''}); setData({...data,hepatitis_B:e.target.value})}}
                              >
                                    <option value={0} selected = {data?.hepatitis_B == 0 }>سلبي</option>
                                    <option value={1} selected = {data?.hepatitis_B == 1 }>ايجابي</option>
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
                                className='w-full mb-3 p-2 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,hepatitis_C:''}); setData({...data,hepatitis_C:e.target.value})}}
                              >
                                    <option value={0} selected = {data?.hepatitis_C == 0 }>سلبي</option>
                                    <option value={1} selected = {data?.hepatitis_C == 1 }>ايجابي</option>
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
                                className='w-full mb-3 p-2 border border-gray-100 rounded '
                                onChange={(e)=>{setErrors({...errors,syphilis:''}); setData({...data,syphilis:e.target.value})}}
                              >
                                    <option value={0} selected = {data?.syphilis == 0 }>سلبي</option>
                                    <option value={1} selected = {data?.syphilis == 1 }>ايجابي</option>
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
                                className='w-full mb-3 p-2 border border-gray-100 rounded '
                                onChange={(e)=>{setErrors({...errors,malaria:''}); setData({...data,malaria:e.target.value})}}
                              >
                                    <option value={0} selected = {data?.malaria == 0 }>سلبي</option>
                                    <option value={1} selected = {data?.malaria == 1 }>ايجابي</option>
                              </select>
                              {
                                    errors.malaria != ''?
                                    <div className='text-sm text-red-500'>{errors.malaria}</div> :'' 
                              }
                        </div>
                  </div>
                  <div className='flex justify-end item-center gap-2 my-4'>
                        <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button onClick={handleSave} disabled={saving}  type="button" className='px-4 py-2 bg-[#82181A] text-white rounded  disabled:bg-gray-300 hover:bg-red-700'>حفظ البيانات</button>
                  </div>
                  
            </div>
    </div> :<div className='text-red-500 text-sm'>
            لا يوجد بيانات لعرضها 
    </div>
  )
}

export default EditTest
