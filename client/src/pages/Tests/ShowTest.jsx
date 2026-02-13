/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { Breadcrumb, Loader } from '../../components';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { BASE_URL } from '../../Constrants/Constrant';
const ShowTest = () => {
  const params = useParams();
  const {token} = useSelector(state=>state.user);
  const [data,setData] =useState();
  const [loadding,setLoadding] = useState(false);

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
  return (
     loadding? <Loader/> : data ? <div className='p-4'>
            {/* history */}
            <Breadcrumb items={[{label:'التحاليل الدموية  (المختبر)',href:'/tests'},{label:'عرض أختبار الوحدة الدموية',href:'#'}]}/>
            <div className='shadow-md bg-white  p-6 rounded-md border-t border-gray-50 mt-8'>
                  <h2 className="text-xl font-bold mb-4" > <i className='fa fa-edit text-red-400'></i> أضافة معلومات المتبرع</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2  gap-2 '>
                        <div  className='flex flex-col gap-1'>
                              <label>الزمرة الدموية</label>
                              <input disabled readOnly 
                                    type="text"
                                    className='bg-gray-50 p-2 border border-gray-100 rounded' 
                                    value={data?.unit_id}
                              />
                        </div>
                        <div  className='flex flex-col gap-1'>
                              <label>اختبار نقص المناعة البشرية (HIV)</label>
                              <input disabled readOnly 
                                    type="text"
                                    className='bg-gray-50 p-2 border border-gray-100 rounded' 
                                    value={data?.HIV ? "ايجابي" : "سلبي"}
                              />
                        </div>
                        <div  className='flex flex-col gap-1'>
                              <label>اختبار التهاب الكبد  (hepatitis_B)</label>
                              <input disabled readOnly 
                                    type="text"
                                    className='bg-gray-50 p-2 border border-gray-100 rounded' 
                                    value={data?.hepatitis_B ? "ايجابي" : "سلبي"}
                              />
                        </div>
                        <div  className='flex flex-col gap-1'>
                              <label>اختبار التهاب الكبد  (hepatitis_C)</label>
                              <input disabled readOnly 
                                    type="text"
                                    className='bg-gray-50 p-2 border border-gray-100 rounded' 
                                    value={data?.hepatitis_C ? "ايجابي" : "سلبي"}
                              />
                        </div>
                        <div  className='flex flex-col gap-1'>
                              <label>اختبار الزُهري   (syphilis)</label>
                              <input disabled readOnly 
                                    type="text"
                                    className='bg-gray-50 p-2 border border-gray-100 rounded' 
                                    value={data?.syphilis ? "ايجابي" : "سلبي"}
                              />
                        </div>
                        <div  className='flex flex-col gap-1'>
                              <label>اختبار الملاريا   (malaria)</label>
                              <input disabled readOnly 
                                    type="text"
                                    className='bg-gray-50 p-2 border border-gray-100 rounded' 
                                    value={data?.malaria ? "ايجابي" : "سلبي"}
                              />
                        </div>
                  </div>
                  
            </div>
    </div> :<div className='text-red-500 text-sm'>
            لا يوجد بيانات لعرضها 
    </div>
  )
}

export default ShowTest
