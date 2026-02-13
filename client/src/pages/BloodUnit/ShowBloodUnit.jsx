/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Breadcrumb, Loader } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const ShowBloodUnit = () => {
 const params = useParams();
 const [data,setData] = useState();
 const [lodding,setLodding] = useState();
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
                  
                        setData(resData.data)
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
  return (
     lodding? <Loader/>:<div className='p-4'>

            <Breadcrumb items={[{label:'الوحدات الدموية',href:'/blood-units'},{label:'عرض وحدة دموية',href:'#'}]}/>
            <div className='shadow-md bg-white p-4 rounded mt-4 border-t border-gray-50'>
                  <h1 className='text-lg font-semibold my-2'><i className='fas fa-eye  text-red-400 me-2'></i><span>عرض الوحدة الدموية</span></h1>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
                        <div className='flex flex-col my-2'>
                              <label>الزمرة الدموية</label>
                              <input className='my-1 rounded border border-gray-100 px-4 py-2 bg-gray-50'  type="text" disabled readOnly  value={data?.bloodType}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>حجم الوحدة الدموية</label>
                              <input className='my-1 rounded border border-gray-100 px-4 py-2 bg-gray-50'  type="text" disabled   value={data?.volume}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>اسم المتبرع</label>
                              <input className='my-1 rounded border border-gray-100 px-4 py-2 bg-gray-50'  type="text" disabled   value={data?.donor?.name || 'N/A'}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>نوع الوحدة الدموية</label>
                              <input className='my-1 rounded border border-gray-100 px-4 py-2 bg-gray-50'  type="text" disabled   value={data?.type}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>الحالة</label>
                              <input className='my-1 rounded border border-gray-100 px-4 py-2 bg-gray-50'  type="text" disabled   value={data?.status}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>تاريخ التبرع</label>
                              <input className='my-1 rounded border border-gray-100 px-4 py-2 bg-gray-50'  type="text" disabled   value={data?.donationDate}/>
                        </div>
                        <div className='flex flex-col my-2'>
                              <label>تاريخ الانتهاء</label>
                              <input className='my-1 rounded border border-gray-100 px-4 py-2 bg-gray-50'  type="text" disabled   value={data?.expiredDate}/>
                        </div>
                        
                  </div>
            </div>
    </div>
  )
}

export default ShowBloodUnit
