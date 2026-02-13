import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { useParams } from 'react-router-dom';
import { Breadcrumb, Loader } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const ShowExport = () => {
  const {token} = useSelector(state=>state.user);
  const params   = useParams();
  const [loadding, setLoadding]   = useState(false);
  const [data,setData] = useState();
   
  const fetchData = async ()=>{
      try{
            setLoadding(true);
            const response = await fetch(`${BASE_URL}/exports/${params.id}`,{
                  headers:{
                        'Accept':'application/json',
                        'Authorization':'Bearer '+token
                  }
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR);
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.status == 404){
                  toast.error(ErrorMessage.NOT_FOUND);
            }else if(response.ok){
                  if(resData.success){
                        setData(resData.data[0]);
                  }else{
                        toast.error(resData.message);
                  }
            }else{
                  toast.error(ErrorMessage.ANY);
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
      loadding ? <Loader/> : data? <div className='p-4'>
            <Breadcrumb items={[{label:'الصادرات',href:'/exports'},{label:'عرض صادر',href:'#'}]}/>
 
            <div className='bg-white p-4 rounded-md border-t border-gray-50 shadow-md mt-8'>
                  <div className='p-6 max-w-5xl mx-auto space-y-6  my-4 '>
                        <h2 className="text-xl font-bold mb-4">معلومات التصدير</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2  gap-2'>
                        
                              <div className='flex flex-col gap-1'>
                              <label for="destenation" >الوجهة</label>
                              <div>
                                          <input 
                                          type="text" 
                                          name="destenation"
                                          id='destenation' 
                                          value={data?.destenation}
                                          readOnly
                                          disabled
                                          className='p-1  w-full border border-gray-100 rounded '
                                          /> 
                                          
                              </div>
                              </div>
                              <div className='flex flex-col gap-1'>
                              <label for="exportDate" >تاريخ التصدير</label>
                              <div>
                                          <input 
                                          type="date" 
                                          name="exportDate"
                                          id='exportDate' 
                                          value={data?.exportDate}
                                          readOnly
                                          disabled
                                          className='p-1 w-full border border-gray-100 rounded '
                                          /> 
                              </div>
                              </div>
                        </div>
                        
                  </div>
                  <div className='p-6 my-6 max-w-5xl mx-auto space-y-6 '>
                        <h2 className="text-xl font-bold mb-4">الوحدات الدموية</h2>
                        {/* Table */}
                        <div className="flex flex-col w-full h-full overflow-x-auto text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                              <table className="w-full text-left table-auto min-w-max">
                                    <thead className="bg-gradient-to-r from-red-100 to-red-200">
                                          <tr>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                          # 
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                الزمرة الدموية 
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                الحجم
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                تاريخ التبرع
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                تاريخ الانتهاء                        
                                          </th>

                                          </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-200">
                                          {data?.units?.map((item,index) => (
                                          <tr key={item.id} className="hover:bg-slate-50 transition">
                                                <td className="p-4 border-b border-slate-200">{index+1}</td>
                                                <td className="p-4 border-b border-slate-200">{item.bloodType}</td>
                                                <td className="p-4 border-b border-slate-200">{item.volume}</td>
                                                <td className="p-4 border-b border-slate-200">{item.donationDate }</td>
                                                <td className="p-4 border-b border-slate-200">{item.expiredDate }</td>
                                          
                                          </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                                          
                  </div>
            </div>
    </div> : <div>
            لا يوجد بيانات لعرضها
    </div>
  )
}

export default ShowExport
