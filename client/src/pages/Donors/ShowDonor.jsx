import React, { useEffect, useState } from 'react'
import { Breadcrumb, Loader } from '../../components'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../Constrants/Constrant';

const ShowDonor = () => {
  const [loadding,setLoadding] = useState(false)
  const [data,setData] = useState();
  const params = useParams()
  const {token} = useSelector(state=>state.user);
  const fetchData = async()=>{
      try{
            setLoadding(true);
            const response = await fetch(`${BASE_URL}/donors/${params.id}`,{
                  headers:{
                        'Accept':'application/json',
                        'Authorization':'Bearer '+token
                  }
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error("حدثت مشكلة في السيرفر الرجاء اعادة المحاولة من جديد")
            }else if(response.status == 401 || response.status == 403){
                  toast.error("انت غير مخول للقيام في هذه العملية ")
            }else if(response.status == 404){
                  toast.error("ان العنصر المطلوب غير موجود")
            }else if(response.ok){
                  if(resData.success){
                        setData(resData.data);
                  }else{
                        toast.error(resData.message)
                  }
            }else{
                  toast.error('حدثت مشكلة غير معروفة')
            }
            

      }catch(err){
            console.log(err);

      }finally{
            setLoadding(false);
      }
  }
  useEffect(()=>{
      fetchData();
  },[])

  return (
     loadding ? <Loader/> : <div className='p-4'>
            <Breadcrumb items={[{label:'المتبرعين',href:'/donors'},{label:'عرض معلومات متبرع',href:'#'}]}/>

            <div className='bg-white border-t border-gray-50 shadow-md p-4 rounded mt-8'>
                  <h1 className='text-xl font-semibold'><i className='fa fa-eye text-red-400'></i> عرض معلومات المتبرع</h1>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
                        <div className='flex flex-col my-2'>
                              <label>الاسم</label>
                              <input className='my-1 rounded border border-gray-100 p-2 bg-gray-50'  type="text" disabled readOnly  value={data?.name}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>البريد الالكتروني</label>
                              <input className='my-1 rounded border border-gray-100 p-2 bg-gray-50'  type="text" disabled readOnly  value={data?.email}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>رقم الجوال</label>
                              <input className='my-1 rounded border border-gray-100 p-2 bg-gray-50'  type="text" disabled readOnly  value={data?.phone}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>الزمرة الدموية</label>
                              <input className='my-1 rounded border border-gray-100 p-2 bg-gray-50'  type="text" disabled readOnly  value={data?.bloodType}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>تاريخ اخر تبرع</label>
                              <input className='my-1 rounded border border-gray-100 p-2 bg-gray-50'  type="text" disabled readOnly  value={data?.lastDonation || 'N/A'}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>تاريخ الميلاد</label>
                              <input className='my-1 rounded border border-gray-100 p-2 bg-gray-50'  type="text" disabled readOnly  value={data?.DOB || 'N/A'}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>عدد التبرعات</label>
                              <input className='my-1 rounded border border-gray-100 p-2 bg-gray-50'  type="text" disabled readOnly  value={data?.donations || 'N/A'}/>
                        </div>      
                  </div>
                  
            </div>
    </div>
  )
}

export default ShowDonor
