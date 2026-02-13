import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const AddExport = () => {
  const {token} = useSelector(state=>state.user);
  const navigate = useNavigate();
  const [isSearch,setIsSearch] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [exportInfo,setExportInfo] = useState({
      destenation:'',
      exportDate:'',
  }) 
  const [unit,setUnit] = useState({
      id:'',
      bloodType:'',
      volume:'',
      donationDate:'',
      expiredDate:''
  });
  const [Uniterror,setUnitError] = useState('')
  const [units, setUnits] =  useState([])
  const [errors,setError] = useState({
      destenation:'',
      exportDate:'',
      units :''
  })

  const handleGetUnit =async()=>{
      if(units.find((item)=>item.id == unit.id)){
            setUnitError('انت قمت بأضافة هذا العنصر بشكل مسبق')
            return;
      }
      try{
            setIsSearch(true);
            const response = await fetch(`${BASE_URL}/blood-units/${unit.id}`,{
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
                  setUnitError('الوحدة الدموية غير موجودة')
            }else if(response.ok){
                  if(resData.success){
                        if(resData.data.status != 'available'){
                              setUnitError('الوحدة الدموية غير متوفرة الرجاء ادخال عينة اخرى')
                        }else{
                              setUnits([...units,{
                                    id:resData.data.id,
                                    bloodType:resData.data.bloodType,
                                    volume:resData.data.volume,
                                    donationDate:resData.data.donationDate,
                                    expiredDate: resData.data.expiredDate,
                                    type:resData.data.type
                              }])
                        }
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

  const handleDeleteItem =(id)=>{
      const items = units.filter((item)=> item.id != id);
      setUnits(items);
  }

  const isExportValid = ()=>{
      let isPassed = true;
      let errors = {}
      if(exportInfo.destenation == ''){
            errors.destenation = 'حقل الوجهة مطلوب'
            isPassed =false;
      }     
      if(exportInfo.exportDate == ''){
            errors.exportDate = 'حقل تاريخ التصدير مطلوب'
            isPassed= false;
      }
      if(!isPassed){
            setError(errors);
      }

      if(units.length == 0){
            toast.error('عددالوحدات الدموية المصدرة يجب ان يكون على  اكبر او تساوي 1')
            isPassed = false;
      }
      return isPassed;
  }
  const handleSave =async ()=>{
      if(!isExportValid()) return; 
      const unit_ids = units.map((item)=>item.id);
      try{
            setSaving(true);
            const response = await fetch(`${BASE_URL}/exports/`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify({...exportInfo,units:unit_ids})
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR);
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.status == 422){
                  toast.error(ErrorMessage.DATA_ERROR);
                  setError({
                        destenation:resData.errors?.destenation?.[0] || '',
                        exportDate:resData.errors?.expiredDate?.[0] || '',
                        units:resData.errors?.units?.[0] || ''
                  })
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


  return (
    <div className='p-4'>
            <Breadcrumb items={[{label:'الصادرات',href:'/exports'},{label:'أضافة صادر',href:'#'}]}/>
            <div className='bg-white p-4 shadow-md rounded border-t border-gray-50 space-y-6 mt-8'>
                  <div className='max-w-5xl mx-auto space-y-6 bg-white my-4 '>
                        <h2 className="text-xl font-bold mb-4">معلومات التصدير</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2  gap-2'>
                        
                              <div className='flex flex-col gap-1'>
                              <label for="destenation" required>الوجهة</label>
                              <div>
                                          <input 
                                          type="text" 
                                          name="destenation"
                                          id='destenation' 
                                          value={exportInfo.destenation}
                                          onChange={(e)=>{setError({...errors,destenation:''});setExportInfo({...exportInfo,destenation:e.target.value})}}
                                          className='p-1  w-full border border-gray-100 rounded '
                                          /> 
                                          {
                                                errors.destenation? <div className='text-sm text-red-500'>
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
                                          value={exportInfo.exportDate}
                                          onChange={(e)=>{setError({...errors,exportDate:''});setExportInfo({...exportInfo,exportDate:e.target.value})}}
                                          className='p-1 w-full border border-gray-100 rounded '
                                          /> 
                                          {
                                                errors.exportDate? <div className='text-sm text-red-500'>
                                                      {errors.exportDate}
                                                </div> :''
                                          }
                              </div>
                              </div>
                        </div>
                        
                  </div>
                  <div className='max-w-5xl mx-auto space-y-6 bg-white my-4 mt-8'>
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
                                          <i className='fa fa-search'></i>
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
                                                النوع
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                الحجم
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                تاريخ التبرع
                                          </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                                تاريخ الانتهاء                             </th>
                                          <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                          
                                          </th>
                                          </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-200">
                                          {units.map((item) => (
                                          <tr key={item.id} className="hover:bg-slate-50 transition">
                                                <td className="p-4 border-b border-slate-200">{item.id}</td>
                                                <td className="p-4 border-b border-slate-200">{item.bloodType}</td>
                                                <td className="p-4 border-b border-slate-200">{item.type}</td>
                                                <td className="p-4 border-b border-slate-200">{item.volume}</td>
                                                <td className="p-4 border-b border-slate-200">{item.donationDate }</td>
                                                <td className="p-4 border-b border-slate-200">{item.expiredDate }</td>
                                                <td className="p-4 border-b border-slate-200">
                                                      <i class="fa-solid fa-trash" onClick={()=>handleDeleteItem(item.id)} title="Delete"></i>
                                                </td>
                                          </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                        {
                              errors.units ? <div className='text-sm text-red-500'>
                                    {errors.units}
                              </div> :''
                        }
                        
                        
                  </div>
                  <div className='flex items-center justify-end gap-2'>
                        <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button disabled={saving}  onClick={handleSave} className=' disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 rounded bg-[#82181A] hover:bg-red-800 text-white' type="button">
                              حفظ البيانات
                        </button>
                  </div>
                  
            </div>
    </div>
  )
}

export default AddExport
