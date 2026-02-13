import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Loader } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const EditExport = () => {
  const {token} = useSelector(state=>state.user);
  const params   = useParams();
  const navigate = useNavigate();
  const [reload,setReload] = useState(false);
  const [loadding, setLoadding]   = useState(false);
  const [isSearch,setIsSearch] = useState(false);
  const [unit,setUnit] = useState({
      id:''
  });
  const [Uniterror,setUnitError] = useState('');
  const [saving,setSaving] = useState(false);
  const [exportData ,setExportData] = useState({
      destenation:'',
      exportDate:''
  })
  const [errors,setErrors] = useState({
      destenation:'',
      exportDate:''
  })
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
                        setExportData({
                              destenation:resData.data[0]?.destenation || '',
                              exportDate:resData.data[0]?.exportDate  || '',
                        })
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
  
  const handleDeleteItem =async(id,e)=>{
      let item = e.target.parentNode.parentNode;
      const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
      if(!confirmed) return;
      
      try{
            const response = await fetch(`${BASE_URL}/exports/${params.id}/items/${id}`,{
                  method:'DELETE',
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
                        toast.success(resData.message);
                        item.remove();
                  }else{
                        toast.error(resData.message);
                  }
            }else{
                  toast.error(ErrorMessage.ANY);
            }
      }catch(err){
            console.log(err)
      }

  }

  const isExportValid = ()=>{
        let isPassed = true;
        let errors = {}
        if(exportData.destenation == ''){
              errors.destenation = 'حقل الوجهة مطلوب'
              isPassed =false;
        }     
        if(exportData.exportDate == ''){
              errors.exportDate = 'حقل تاريخ التصدير مطلوب'
              isPassed= false;
        }
        if(!isPassed){
            setErrors(errors);
        }
        return isPassed;
    }

  const handleGetUnit = async ()=>{
      try{
            setIsSearch(true);
            const response = await fetch(`${BASE_URL}/exports/${params.id}/items`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify({unit_id:unit.id})
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR);
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.status == 404){
                  setUnitError('الوحدة الدموية غير موجودة')
            }else if(response.ok){
                  if(resData.success){
                        toast.success(resData.message);
                        setReload(p=>!p);
                  }else{
                        toast.error(resData.message);

                  }
            }else{
                  toast.error(ErrorMessage.ANY);
            }
      }catch(err){
            console.log(err)
      }finally{
            setIsSearch(false);
      }
  }
  const handleSave = async()=>{
      if(!isExportValid()) return;
      try{
            setSaving(true);
            const response = await fetch(`${BASE_URL}/exports/${params.id}`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify({...exportData,_method:'PUT'})
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
                        toast.success(resData.message);
                        navigate('/exports');
                  }else{
                        toast.error(resData.message);
                  }
            }else{
                  toast.error(ErrorMessage.ANY);
            }
            
      }catch(err){
            console.log(err);
      }finally{
            setSaving(false);
      }
  }

  useEffect(()=>{
      fetchData();
  },[reload])
 

  

 
 


  return (
      loadding ? <Loader/> : data ? <div className='p-4'>
            <Breadcrumb items={[{label:'الصادرات',href:'/exports'},{label:'تعديل صادر',href:'#'}]}/>
            <div className='bg-white shadow-md rounded-md border-t border-gray-50 mt-8 p-4'>      
                  <div className='p-6 max-w-5xl mx-auto space-y-6  my-4 '>
                        <h2 className="text-xl font-bold mb-4">معلومات التصدير</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2  gap-2'>
                        
                              <div className='flex flex-col gap-1'>
                              <label for="destenation" required>الوجهة</label>
                              <div>
                                          <input 
                                          type="text" 
                                          name="destenation"
                                          id='destenation' 
                                          value={exportData?.destenation}
                                          onChange={(e)=>{setErrors({...errors,destenation:''});setExportData({...exportData,destenation:e.target.value})}}
                                          className='p-1  w-full border border-gray-100 rounded '
                                          /> 
                                          {
                                                errors.destenation ? <div className='text-sm text-red-500'>
                                                      {errors.destenation}
                                                </div> :''
                                          }
                                          
                              </div>
                              </div>
                              <div className='flex flex-col gap-1'>
                              <label for="exportDate" required>تاريخ التصدير</label>
                              <div>
                                          <input 
                                          type="date" 
                                          name="exportDate"
                                          id='exportDate' 
                                          value={exportData?.exportDate}
                                          onChange={(e)=>{setErrors({...errors,exportDate:''});setExportData({...exportData,exportDate:e.target.value})}}
                                          className='p-1 w-full border border-gray-100 rounded '
                                          /> 
                                          {
                                                errors.exportDate ? <div className='text-sm text-red-500'>
                                                      {errors.exportDate}
                                                </div> :''
                                          }
                              </div>
                              </div>
                        </div>
                        
                  </div>
                  <div className='p-6 max-w-5xl mx-auto space-y-6  my-4 '>
                        <h2 className="text-xl font-bold mb-4">الوحدات الدموية</h2>
                        <div>
                              <label for="unit" required>رقم الوحدة الدموية</label>
                              <div className='flex items-start gap-1 mt-2'>
                                    <div className='w-full'>
                                          <input 
                                          type="text" 
                                          name="unit"
                                          id='unit' 
                                          value={unit.id}
                                          onChange={(e)=>{setUnitError('');setUnit({...unit,id:e.target.value})}}
                                          className='p-1  w-full border border-gray-100 rounded '
                                          /> 
                                          {
                                                Uniterror ? <div className='text-sm text-red-500'>
                                                      {Uniterror}
                                                </div> :''
                                          }
                              </div>
                              <div onClick={()=>handleGetUnit()} className={`${isSearch ? 'bg-gray-300 cursor-not-allowed': 'bg-red-500 text-white'}   rounded p-2 w-30 flex items-center justify-center`}>
                                          <i className='fa fa-plus'></i>
                                    </div>
                              </div>
                              
                        </div>
                  
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
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                                  
                                          </th>

                                          </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-200">
                                          {data?.units.map((item,index) => (
                                          <tr key={item.id} className="hover:bg-slate-50 transition">
                                                <td className="p-4 border-b border-slate-200">{index+ 1}</td>
                                                <td className="p-4 border-b border-slate-200">{item.bloodType}</td>
                                                <td className="p-4 border-b border-slate-200">{item.volume}</td>
                                                <td className="p-4 border-b border-slate-200">{item.donationDate }</td>
                                                <td className="p-4 border-b border-slate-200">{item.expiredDate }</td>
                                                <td className="p-4 border-b border-slate-200">
                                                      <i class="fa-solid fa-trash" onClick={(e)=>handleDeleteItem(item.id,e)} title="Delete"></i>
                                                </td>
                                                
                                          </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                                          
                  </div>
                  <div className='flex justify-end items-center gap-2 my-4'>
                        <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button disabled={saving}  onClick={handleSave} className=' disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 rounded bg-[#82181A] hover:bg-red-800 text-white' type="button">
                              حفظ البيانات
                        </button>
                  </div>
            </div>
    </div> : <div>
            لا يوجد بيانات لعرضها
    </div>
  )
}

export default EditExport
