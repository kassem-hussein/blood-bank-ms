import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Breadcrumb, Loader } from '../../components';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from './../../Utils/RequestMessage';
import { BASE_URL } from '../../Constrants/Constrant';

const ShowImport = () => {
 const [loadding,setLoadding] = useState(false);
 const params = useParams();
 const [data,setData]= useState();
 const {token} = useSelector(state=>state.user);

 const fetchData = async()=>{
      try{
            setLoadding(true)
            const response = await fetch(`${BASE_URL}/imports/${params.id}`,{
                  headers:{

                        'Accept':'application/json',
                        'Authorization':'Bearer '+token
                  }
            })
            const resData = await response.json()
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR)
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.ok){
                  if(resData.success){
                        setData(resData.data);
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
 },[])

return (
      loadding? <Loader/>  : data? <div className='p-4'>
            <Breadcrumb items={[{label:'الواردات',href:'/imports'},{label:'عرض وارد',href:'#'}]}/>


            <div className='bg-white shadow-md rounded-md border-t border-gray-50 mt-8'>
                  <div className=' my-4 p-6 '>
                        <h2 className="text-xl font-bold mb-4">معلومات المصدر</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                              <div className='flex flex-col gap-2'>
                                    <label  for="source">المصدر</label>
                                    <div>
                                          <input
                                          type="text"
                                          id='source'
                                          name="source"
                                          readOnly
                                          disabled
                                          placeholder="المصدر"
                                          value={data?.source}
                                          className="w-full p-2 border border-gray-100 rounded"
                                          />
                                    
                                    </div>
                              </div>
                              <div className='flex flex-col gap-2'>
                                    <label for="importDate" >تاريخ التوريد</label>
                                    <div>
                                          <input
                                          type="date"
                                          name="importDate"
                                          readOnly
                                          disabled
                                          id='importDate'
                                          value={data?.importDate}
                                          className="w-full p-2 border border-gray-100 rounded"
                                          />
                                    
                                    </div>
                              </div>
                        </div>
                  </div>

                  
                  <div className='my-4 p-6 '>
                        <h2 className="text-xl font-bold mb-4">معلومات  الوحدات الدموية</h2>
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
                                                النوع
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                الكمية
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
                                          {data?.units.map((item) => (
                                          <tr key={item.id} className="hover:bg-slate-50 transition">
                                                <td className="p-4 border-b border-slate-200">{item.id}</td>
                                                <td className="p-4 border-b border-slate-200">{item.bloodType}</td>
                                                <td className="p-4 border-b border-slate-200">{item.type}</td>
                                                <td className="p-4 border-b border-slate-200">{item.volume }</td>
                                                <td className="p-4 border-b border-slate-200">{item.donationDate }</td>
                                                <td className="p-4 border-b border-slate-200">{item.expiredDate }</td>
                                          </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  
                        {/* <div className='flex flex-col gap-2'>
                        {
                              data?.units.map((item,key)=>{
                                    return <div key={key} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 border p-1 rounded border-gray-100'>
                                          
                                          <div className='flex flex-col gap-2'>
                                                <label for="bloodType" >الزمرة الدموية</label>
                                                <div>
                                                      
                                                      <select
                                                      type="text"
                                                      id='bloodType'
                                                      name="bloodType"
                                                      placeholder="الزمرة الدموية"
                                                      value={item.bloodType}
                                                      className="w-full  p-2 border border-gray-100 rounded"
                                                      >
                                                            <option value="">اختر الزمرة الدموية</option>      
                                                            <option value="A+"      selected={item.bloodType == 'A+'}>A+</option>      
                                                            <option value="A-"      selected={item.bloodType == 'A-'}>A-</option>      
                                                            <option value="B+"      selected={item.bloodType == 'B+'}>B+</option>      
                                                            <option value="B-"      selected={item.bloodType == 'B-'}>B-</option>      
                                                            <option value="AB+"     selected={item.bloodType == 'AB+'}>AB+</option>      
                                                            <option value="AB-"     selected={item.bloodType == 'AB-'}>AB-</option>      
                                                            <option value="O+"      selected={item.bloodType == 'O+'}>O+</option>      
                                                            <option value="O-"      selected={item.bloodType == 'O-'}>O-</option>      
                                                      </select>
                                                </div>

                                          </div>
                                          <div className='flex flex-col gap-2'>
                                                <label  for="type"  >نوع الوحدة</label>
                                                <div>
                                                      <input
                                                      type="text"
                                                      id='type'
                                                      readOnly
                                                      disabled
                                                      name="type"
                                                      placeholder="نوع الوحدة"
                                                      value={item.type}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />
                                                </div>

                                          </div>

                                          <div className='flex flex-col gap-2'>
                                                <label for="volume" >حجم الوحدة</label>
                                                <div>
                                                      <input
                                                      type="number"
                                                      name="volume"
                                                      readOnly
                                                      disabled
                                                      id='volume'
                                                      placeholder="حجم الوحدة"
                                                      value={item.volume}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />
                                                </div>
                                          </div>
                                          <div className='flex flex-col gap-2'>
                                                <label for="donationDate" >تاريخ التبرع</label>
                                                <div>
                                                      <input
                                                      type="date"
                                                      id='dontaionDate'
                                                      name="donationDate"
                                                      readOnly
                                                      disabled
                                                      placeholder="تاريخ التبرع"
                                                      value={item.donationDate}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />
                                                      
                                                </div>
                                          </div>
                                          <div className='flex flex-col gap-2'>
                                                <label for="expiredDate" >تاريخ الانتهاء</label>
                                                <div>
                                                      <input
                                                      type="date"
                                                      id='expiredDate'
                                                      readOnly
                                                      disabled
                                                      name="expiredDate"
                                                      placeholder="تاريخ الانتهاء"
                                                      value={item.expiredDate}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />
                                                      
                                                </div>
                                          </div>
                                    </div>
                                    
                              })
                        }
                  
                        </div> */}
                  </div>
            </div>
    </div> : <div >
      لا يوجد بيانات لعرضها 
    </div> 
  )
}

export default ShowImport
