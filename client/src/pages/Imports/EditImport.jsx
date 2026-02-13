import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Breadcrumb, Loader } from '../../components';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from './../../Utils/RequestMessage';
import { BASE_URL } from '../../Constrants/Constrant';

const EditImport = () => {
 const [loadding,setLoadding] = useState(false);
 const [popup,setPopup] = useState(false);
 const [saving,setSaving] = useState(false);
 const [refetch,setRefetch] = useState(false);
 const params = useParams();
 const [importData,setImportData] = useState({
      source:'',
      importDate:''
 })
 const [importError,setImportError]= useState({
      source:'',
      importDate:''
 })
 const [data,setData]= useState();
 const {token} = useSelector(state=>state.user);
 const [item , setItem] = useState({
      id:'',
      bloodType:'',
      type:'',
      volume:'',
      donationDate:'',
      expiredDate:''
 })
 const [itemError,setItemError] = useState({
      bloodType:'',
      type:'',
      volume:'',
      donationDate:'',
      expiredDate:''
 })


 const openPopup = (index)=>{
      document.body.classList.add('overflow-hidden');
      let {id,bloodType,type,volume,donationDate,expiredDate} = data.units[index]; 
      setItem({
            id,
            bloodType,
            type,
            volume,
            donationDate,
            expiredDate
      })
      setItemError({
            bloodType:'',
            type:'',
            volume:'',
            donationDate:'',
            expiredDate:''
      })
      console.log(item)
      setPopup(p=>!p);
 }

 const isItemValid = ()=>{
      let passed = true;
      let bloodtypes =[
            'A+','A-','B+','B-','AB+','AB-','O+','O-'
            ];
      if(!bloodtypes.find((el=>el == item.bloodType))){
            setItemError({...itemError,bloodType:'الزمرة الدموية يجب ان تكون من : A+,A-,B+,B-,AB+,AB-,O+,O-'});
            passed =false;
      }
      if(item.type.trim() == ''){
            setItemError({...itemError,type:'حقل نوع الوحدة مطلوب'});              
            passed =false;
      }
      if(item.volume == ''){
            setItemError({...itemError,volume:'حقل حجم الوحدة مطلوب'});
            passed =false;
      }
      
      if(item.donationDate.trim() == ''){
            setItemError({...itemError,donationDate:'تاريخ التبرع بالوحدة مطلوب'});
            passed =false;
      }
      if(item.expiredDate.trim() == ''){
            setItemError({...itemError,expiredDate:'تاريخ انتهاء صلاحية الوحدة مطلوب'});
            passed = false;
      }

      return passed;
 }
 const handleSaveItem = async()=>{
      setSaving(true);
      let isValid = isItemValid();
      if(!isValid) {
            setSaving(false);
            return;
      };
      const {id,...rest} = item;
      try{
            const response = await fetch(`${BASE_URL}/imports/${params.id}/items/${id}`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify({...rest,_method:'PUT'})
            })
            const resData = await response.json()
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR)
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.status == 422){
                  setItemError({...itemError,
                        bloodType:resData.errors?.bloodType?.[0] || '',
                        type:resData.errors?.type?.[0] || '',
                        volume:resData.errors?.volume?.[0] || '',
                        donationDate:resData.errors?.donationDate?.[0] || '',
                        expiredDate:resData.errors?.bloodType?.[0] || '',
                  })
            }else if(response.ok){
                  if(resData.success){
                        closeModel();
                        toast.success(resData.message)
                        setRefetch(p=>!p);

                  }else{
                        toast.error(resData.message);
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
                        setImportData({
                              source:resData.data?.source || '',
                              importDate:resData.data?.importDate || ''
                        });
                      
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

 const handleDeleteItem =async (id,e)=>{
         let item = e.target.parentNode.parentNode;
         try{
         const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
         if(!confirmed) return;
         const response = await fetch(`${BASE_URL}/imports/${params.id}/items/${id}`,{
               method:'DELETE',
               headers:{
               'Accept':'application/json',
               'Authorization':'Bearer '+token
               }
         })
         if(!response.ok) {
               toast.error(response.statusText)
         }else{
               const resData = await response.json();
               if(resData.success){
                     toast.success('تمت عملية الحذف بنجاح')
                     item.remove();
               }else{
               toast.error(resData.message);
               }
         }
   
         }catch(err){
         console.log(err)
         }
     }

 const isImportValid = ()=>{
      let passed = true;
      
      if(importData.source.trim() == ''){
            setImportError({...importError,source:'حقل المصدر  مطلوب'});              
            passed =false;
      }
      if(importData.importDate == ''){
            setItemError({...importError,importDate:'حقل تاريخ التوريد مطلوب'});
            passed =false;
      }
    
      return passed;

 }
 const handleSaveImport =async ()=>{
      setSaving(true);
      if(!isImportValid()){
            setSaving(false);
            return 
      }
      try{
         const response = await fetch(`${BASE_URL}/imports/${params.id}`,{
            method:'POST',
            headers:{
                  'Accept':'application/json',
                  'Content-Type':'application/json',
                  'Authorization':'Bearer '+token
            },
            body:JSON.stringify({...importData,_method:'PUT'})
         })
         const resData = await response.json()
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR)
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.status == 422){
                  setImportError({
                        source:resData.errors?.source?.[0] || '',
                        importDate:resData.errors?.importDate?.[0] || ''
                  })
            }else if(response.ok){
                  if(resData.success){
                        toast.success(resData.message)
                        setRefetch(p=>!p);
                  }else{
                        toast.error(resData.message);
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

 const closeModel = ()=>{
      document.body.classList.remove('overflow-hidden');
      setPopup(false);
 }

 useEffect(()=>{
      fetchData();
 },[refetch])

return (
      loadding? <Loader/>  : data? <div className='p-4'>
            <Breadcrumb items={[{label:'الواردات',href:'/imports'},{label:'تعديل وارد',href:'#'}]}/>

            <div className='bg-white my-4 p-6 shadow-md rounded-md border-t border-gray-50'>
                  <h2 className="text-xl font-bold mb-4">معلومات المصدر</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                        <div className='flex flex-col gap-2'>
                              <label  for="source" required>المصدر</label>
                              <div>
                                    <input
                                    type="text"
                                    id='source'
                                    name="source"
                                    placeholder="المصدر"
                                    value={importData?.source}
                                    onChange={(e)=>{setImportError({...importError,source:''});setImportData({...importData,source:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />
                                     {
                                          importError.source?<div className='text-sm text-red-500'>
                                                {importError.source}
                                          </div> :''
                                     }
                              </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                              <label for="importDate" required>تاريخ التوريد</label>
                              <div>
                                    <input
                                    type="date"
                                    name="importDate"
                                    id='importDate'
                                    value={importData?.importDate}
                                    onChange={(e)=>{setImportError({...importError,importDate:''});setImportData({...importData,importDate:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />

                                    {
                                          importError.importDate?<div className='text-sm text-red-500'>
                                                {importError.importDate}
                                          </div> :''
                                     }
                              
                              </div>
                        </div>
                  </div>
                  <div className='my-4'>
                        <button disabled={saving} onClick={()=>handleSaveImport()}className='disabled:bg-gray-300 disabled:cursor-not-allowed  p-2 bg-[#82181A] hover:bg-red-800  text-white rounded '>حفظ البيانات</button>

                  </div>
            </div>            
            <div className='bg-white my-4 p-6 shadow-md rounded-md border-t border-gray-50'>
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
                                    <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                         
                                    </th>
                                    </tr>
                              </thead>
                              <tbody className="text-sm divide-y divide-gray-200">
                                    {data?.units.map((item,key) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                          <td className="p-4 border-b border-slate-200">{item.id}</td>
                                          <td className="p-4 border-b border-slate-200">{item.bloodType}</td>
                                          <td className="p-4 border-b border-slate-200">{item.type}</td>
                                          <td className="p-4 border-b border-slate-200">{item.volume }</td>
                                          <td className="p-4 border-b border-slate-200">{item.donationDate }</td>
                                          <td className="p-4 border-b border-slate-200">{item.expiredDate }</td>
                                          <td className="p-4 border-b border-slate-200">
                                                <i onClick={()=>openPopup(key)} className='fa-solid fa-pen-to-square' title='Edit'></i>
                                               <i class="fa-solid fa-trash text-red-500" onClick={(e)=>handleDeleteItem(item.id,e)} title="Delete"></i>

                                          </td>
                                    </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>

                  {
                        popup ? <div className=''>
                              <div className='fixed top-0 left-0 w-full h-screen bg-black opacity-75 z-[1]'></div>
                              <div className='fixed top-0 left-0 w-full h-screen flex z-[2] items-center justify-center'>
                                    <div key={item.id} className='bg-white p-8 grid grid-cols-1 sm:grid-cols-2  gap-2 border p-1 rounded border-gray-100'>
                                          
                                          <div className='flex flex-col gap-2'>
                                                <label for="bloodType" required>الزمرة الدموية</label>
                                                <div>
                                                      
                                                      <select
                                                      type="text"
                                                      id='bloodType'
                                                      name="bloodType"
                                                      placeholder="الزمرة الدموية"
                                                      value={item.bloodType}
                                                      onChange={(e)=>{setItemError({...itemError,bloodType:''});setItem({...item,bloodType:e.target.value})}}
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

                                                      {
                                                            itemError.bloodType?<div className='text-sm text-red-500'>
                                                                  {itemError.bloodType}
                                                            </div> :''
                                                      }
                                                </div>

                                          </div>
                                          <div className='flex flex-col gap-2'>
                                                <label  for="type"  required>نوع الوحدة</label>
                                                <div>
                                                      <input
                                                      type="text"
                                                      id='type'
                                                      name="type"
                                                      placeholder="نوع الوحدة"
                                                      value={item.type}
                                                      onChange={(e)=>{setItemError({...itemError,type:''});setItem({...item,type:e.target.value})}}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />

                                                      {
                                                            itemError.type?<div className='text-sm text-red-500'>
                                                                  {itemError.type}
                                                            </div> :''
                                                      }
                                                </div>

                                          </div>

                                          <div className='flex flex-col gap-2'>
                                                <label for="volume" required>حجم الوحدة</label>
                                                <div>
                                                      <input
                                                      type="number"
                                                      name="volume"
                                                      
                                                      id='volume'
                                                      placeholder="حجم الوحدة"
                                                      value={item.volume}
                                                      onChange={(e)=>{setItemError({...itemError,volume:''});setItem({...item,volume:e.target.value})}}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />
                                                      {
                                                            itemError.volume?<div className='text-sm text-red-500'>
                                                                  {itemError.volume}
                                                            </div> :''
                                                      }
                                                </div>
                                                
                                          </div>
                                          <div className='flex flex-col gap-2'>
                                                <label for="donationDate" required>تاريخ التبرع</label>
                                                <div>
                                                      <input
                                                      type="date"
                                                      id='dontaionDate'
                                                      name="donationDate"
                                                     
                                                      placeholder="تاريخ التبرع"
                                                      value={item.donationDate}
                                                      onChange={(e)=>{setItemError({...itemError,donationDate:''});setItem({...item,donationDate:e.target.value})}}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />
                                                      {
                                                            itemError.donationDate?<div className='text-sm text-red-500'>
                                                                  {itemError.donationDate}
                                                            </div> :''
                                                      }
                                                      
                                                </div>
                                          </div>
                                          <div className='flex flex-col gap-2'>
                                                <label for="expiredDate" required>تاريخ الانتهاء</label>
                                                <div>
                                                      <input
                                                      type="date"
                                                      id='expiredDate'
                                                      
                                                      name="expiredDate"
                                                      placeholder="تاريخ الانتهاء"
                                                      value={item.expiredDate}
                                                      onChange={(e)=>{setItemError({...itemError,expiredDate:''});setItem({...item,expiredDate:e.target.value})}}
                                                      className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                      />
                                                      {
                                                            itemError.expiredDate?<div className='text-sm text-red-500'>
                                                                  {itemError.expiredDate}
                                                            </div> :''
                                                      }
                                                      
                                                </div>
                                          </div>
                                          <div>
                                                
                                          </div>
                                          <div className='col-span-2 flex items-center justify-end gap-2'>
                                                <button onClick={()=>closeModel()} className='p-2 border border-gray-100 bg-white hover:text-white hover:bg-gray-800 rounded ' >الغاء</button>
                                                <button disabled={saving} onClick={()=>handleSaveItem()}className='disabled:bg-gray-300 disabled:cursor-not-allowed  p-2 bg-[#82181A] hover:bg-red-800  text-white rounded '>حفظ البيانات</button>
                                          </div>
                                    </div>
                              </div>
                        </div> :''
                  }
                 
                  {/* <div className='flex flex-col gap-2'>
                  {
                        data?.units.map((item,key)=>{
                              return 
                              
                              
                        })
                  }
            
                  </div> */}
            </div>
    </div> : <div >
      لا يوجد بيانات لعرضها 
    </div> 
  )
}

export default EditImport
