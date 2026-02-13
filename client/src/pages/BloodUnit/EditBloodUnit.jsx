/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Breadcrumb, Loader } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const EditBloodUnit = () => {
 const params = useParams();
 const navigate = useNavigate();
 const [data,setData] = useState({
      type:'',
      volume:'',
      donationDate:'',
      expiredDate:'',
      status:''
 });
 const [errors,setErrors] = useState({
      type:'',
      volume:'',
      donationDate:'',
      expiredDate:'',
      status:''
 })
 const [lodding,setLodding] = useState();
 const [saving,setSaving] = useState(false);
 const {token} = useSelector(state=>state.user);
 const fetchData = async()=>{
      try{
            setLodding(true)
            console.log(params.id)
            const response = await fetch(`${BASE_URL}/blood-units/${params.id}`,{
                  headers:{
                       'Accept':'application/json',
                       'Authorization':'Bearer '+token 
                  }
            })
            const resData = await response.json();
            console.log(resData)
            if(!response.ok){
                  toast.error(response.statusText)
            }else{
                  if(resData.success){
                       setData({
                              type:resData.data.type,
                              status:resData.data.status,
                              volume:resData.data.volume,
                              donationDate:resData.data.donationDate,
                              expiredDate:resData.data.expiredDate
                       })
                  }else{
                        toast.error(resData.message);

                  }
            }

      }catch(err){
            console.log(err)
      }finally{
            setLodding(false);
      }
 }

 useEffect(()=>{
      fetchData();
 },[params])

 const checkErros = ()=>{
      if(data.volume == ''){
            setErrors({...errors,volume:'حقل حجم الوحدة الدموية مطلوب'})
            return -1;
      }
      if(data?.type.trim() == ''){
            setErrors({...errors,type:'حقل نوع الوحدة الدموية مطلوبة'})
            return -1;
      }
      if(data?.status == ''){
            setErrors({...errors,status:'حقل حالة الدموية مطلوب'})
            return -1;
      }
      if(data?.donationDate == ''){
            setErrors({...errors,donationDate:'حقل تاريخ التبرع مطلوب'})
            return -1;
      }
      if(data?.expiredDate == ''){
            setErrors({...errors,expiredDate:'حقل تاريخ انتهاء الوحدة الدموية مطلوب'})
            return -1;
      }
      return 1;
 }
 const handleSaveData = async ()=>{
      setSaving(true);
      if(checkErros() == -1){
            setSaving(false);
            return;
      }
      try{
            const response = await fetch(`${BASE_URL}/blood-units/${params.id}`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify({...data,_method:'PUT'})    
            })
            const resData = await response.json();
            console.log(resData)
            if(!response.ok){
                  toast.error(response.statusText)
                  if(resData.errors){
                        setErrors({...errors,
                              type:resData?.errors?.type?.[0] || '',
                              status:resData?.errors?.status?.[0] || '',
                              volume:resData?.errors?.volume?.[0] || '',
                              donationDate:resData?.errors?.donationDate?.[0] || '',
                              expiredDate:resData?.errors?.expiredDate?.[0] || ''
                        });
                        return -1;
                  }
            }
            if(!resData.success){
                  toast.error(resData.message);
                  return -1;
            }else{
                  toast.success(resData.message);
                  navigate('/blood-units')
            }


      }catch(err){
            console.log(err)
      }finally{
            setSaving(false);
      }
 }

  return (
     lodding ? <Loader/> : <div className='p-4'>
            <Breadcrumb items={[{label:'الوحدات الدموية',href:'/blood-units'},{label:'تعديل الوحدة الدموية',href:'#'}]}/>
            <div className='bg-white my-6 px-8 py-4 shadow-md rounded-md border-t border-gray-50 '>
                  <h1 className='text-lg font-semibold my-2'><i className='fa fa-edit  text-red-400 me-2'></i><span>تعديل الوحدة الدموية</span></h1>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='flex flex-col my-2'>
                              <label htmlFor='volume' required>حجم الوحدة الدموية</label>
                              <input id='volume' onChange={(e)=>{setErrors({...errors,volume:''});setData({...data,volume:e.target.value})}} className='my-1 rounded border border-gray-100 px-4 py-2 bg-white'  type="text"   value={data?.volume}/>
                              {
                                    errors.volume.trim() != ''? 
                                    <div className='text-sm text-red-500'>{errors.volume}</div> :''
                              }
                        </div>
                        <div className='flex flex-col my-2'>
                              <label htmlFor='type' required>نوع الوحدة الدموية</label>
                              <input id='type' onChange={(e)=>{setErrors({...errors,type:''});setData({...data,type:e.target.value})}} className='my-1 rounded border border-gray-100 px-4 py-2 bg-white'  type="text"   value={data?.type}/>
                              {
                                    errors.type.trim() != ''? 
                                    <div className='text-sm text-red-500'>{errors.type}</div> :''
                              }
                        </div>
                        <div className='flex flex-col my-2'>
                              <label htmlFor='status' required>الحالة</label>
                              <select id="status" onChange={(e)=>{setErrors({...errors,status:''});setData({...data,status:e.target.value})}} className='my-1  rounded border border-gray-100 px-4 py-2 bg-white' >
                                    <option value="">اختار حالة</option>
                                    <option value="available" selected={ data?.status == 'available'}>متاح</option>
                                    <option value="used"      selected={ data?.status == 'used'}>مستخدم</option>
                                    <option value="expired"   selected={ data?.status == 'expired'}>منتهي الصلاحية</option>
                                    <option value="invalid"   selected={ data?.status == 'invalid'}>عير صالح</option>
                                    <option value="testing"   selected={ data?.status == 'testing'}>قيد الاختبار</option>
                              </select>
                              {
                                    errors.status.trim() != ''? 
                                    <div className='text-sm text-red-500'>{errors.status}</div> :''
                              }
                        </div>
                        <div className='flex flex-col my-2'>
                              <label htmlFor='donationDate' required>تاريخ التبرع</label>
                              <input id='donationDate' onChange={(e)=>{setErrors({...errors,donationDate:''});setData({...data,donationDate:e.target.value})}} className='my-1 rounded border border-gray-100 px-4 py-2 bg-white'  type="date"   value={data?.donationDate}/>
                              {
                                    errors.donationDate.trim() != ''? 
                                    <div className='text-sm text-red-500'>{errors.donationDate}</div> :''
                              }
                        </div>
                        <div className='flex flex-col my-2'>
                              <label htmlFor='expiredDate' required>تاريخ الانتهاء</label>
                              <input id='expiredDate' onChange={(e)=>{setErrors({...errors,expiredDate:''});setData({...data,expiredDate:e.target.value})}} className='my-1 rounded border border-gray-100 px-4 py-2 bg-white'  type="date"   value={data?.expiredDate}/>
                              {
                                    errors.expiredDate.trim() != ''? 
                                    <div className='text-sm text-red-500'>{errors.expiredDate}</div> :''
                              }
                        </div>
                  </div>
                  <div className='flex items-center justify-end gap-2'>
                        <button onClick={()=>navigate(-1)} disabled={saving} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button onClick={handleSaveData} disabled={saving} className='px-4 py-2 bg-[#82181A] border border-[#82181A] text-white rounded hover:border-red-700 hover:bg-red-700 transition'>حفظ البيانات</button>
                  </div>
            </div>
    </div>
  )
}

export default EditBloodUnit
