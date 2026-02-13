/* eslint-disable */

import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { Breadcrumb } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const AddImport = () => {
 const [step,setSetp] = useState(1);
 const [lodding,setLodding] = useState(false)
 const navigate                      = useNavigate();
 const {token} = useSelector(state=>state.user);
 const [found ,setfound] = useState(false);
 const [erorrs,setErrors] =useState({
     source:'',
     importDate:'' ,
 })
 const [importData,setImport] = useState({
      source :'',
      importDate :'',
 })
 const [unitErrors,setUnitError] = useState([{
      bloodType:'',
      type:'',
      volume:'',
      donationDate:'',
      expiredDate:''
}])

 const [units,setUnit] = useState([{
      bloodType:'',
      type:'',
      volume:'',
      donationDate:'',
      expiredDate:''
 }])

 const addNewUnit =()=>{
      setUnit([...units,{
            bloodType:'',
            type:'',
            volume:'',
            donationDate:'',
            expiredDate:''
      }]);
      setUnitError([...unitErrors,{
            bloodType:'',
            type:'',
            volume:'',
            donationDate:'',
            expiredDate:''
      }])
 }

 const handleChildChange = (index, e) => {
    const updated = [...units];
    updated[index][e.target.name] = e.target.value;
    setUnit(updated);
  };
  const handleChildError = (index,key,error)=>{
      const updated =[...unitErrors]
      updated[index][key] = error
  }
  const deleteUnit = (index)=>{
      const updatedUnits = [...units]
      const resultUnits = updatedUnits.filter((item,i) => index != i )
      const updatedErrors = [...unitErrors]
      const resultErrors = updatedErrors.filter((item,i) => index != i )
      setUnit(resultUnits);
      setUnitError(resultErrors);
  }

  
 const handleNextStep =()=>{
      
      console.log(importData)
      if(importData.source.trim() == ''){
            setErrors({...erorrs,source:'حقل مصدر التوريد مطلوب'});
            return;
      }
      if(importData.importDate.trim() == ''){
            setErrors({...erorrs,importDate:'حقل تاريخ التوريد مطلوب'});
            return;
      }
      setSetp(2)

 }


 const checkUnitsData = ()=>{
      let passed = true;
      units.forEach((element,key) => {
            let bloodtypes =[
            'A+','A-','B+','B-','AB+','AB-','O+','O-'
            ];
            if(!bloodtypes.find((item=>item == element.bloodType))){
                  handleChildError(key,'bloodType','الزمرة الدموية يجب ان تكون من : A+,A-,B+,B-,AB+,AB-,O+,O-');
                  passed =false;
            }
            if(element.type.trim() == ''){
                  handleChildError(key,'type','حقل نوع الوحدة مطلوب')                  
                  passed =false;
            }
            if(element.volume.trim() == ''){
                  handleChildError(key,'volume','حقل حجم الوحدة مطلوب')
                  passed =false;
            }
            
            if(element.donationDate.trim() == ''){
                  handleChildError(key,'donationDate','تاريخ التبرع بالوحدة مطلوب')
                  passed =false;
            }
            if(element.expiredDate.trim() == ''){
                  handleChildError(key,'expiredDate','تاريخ انتهاء الوحدة مطلوب')
                  passed = false;
            }

      });

      return passed
  
 }

 const handleSubmit =async ()=>{
      if(units.length == 0){
            toast.error('يجب ان يتم اضافة عنصر واحد على الاقل')
            return;
      }
      setLodding(true);
      if(!checkUnitsData()){
            setTimeout(()=>{
                  setLodding(false)
            },5)
            return;
      }

      try{
            const response = await fetch(`${BASE_URL}/imports`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify({...importData,items:[...units]})
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR);
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.status == 404){
                  toast.error(ErrorMessage.NOT_FOUND);
            }else if(response.status == 422){
                  toast.error(ErrorMessage.DATA_ERROR);
                  setErrors({...data,
                        source:resData?.errors?.source?.[0] || '',
                        importDate:resData?.errors?.importData?.[0]||''
                  })

                  Object.entries(response.errors).forEach(([path, messages]) => {
                        const message = Array.isArray(messages) ? messages[0] : messages;
                        const parts = path.split('.');
                        if (parts.length === 3 && parts[0] === 'items') {
                        // Nested field like items.1.bloodType
                        const index = parseInt(parts[1], 10);
                        const key = parts[2];
                        handleChildError(index, key, message);
                        } 
                  });

            }else if(response.ok){
                  if(resData.success){
                     toast.success(resData.message);
                     navigate('/imports');
                  }else{
                     toast.error(resData.message);
                  }
            }else{
                  toast.erorr(ErrorMessage.ANY);
            }
      }catch(err){
            console.log(err);
      }finally{
            setLodding(false);
      }
    

 }


  return (
    <div className='p-4'>
      <Breadcrumb items={[{label:'الواردات',href:'/imports'},{label:'أضافة وارد',href:'#'}]}/>

      <div className='mt-8'>
            <div>
            <h2 className="sr-only">Steps</h2>

            <div
            className="relative w-[50%] mt-8 after:absolute after:inset-x-0 after:top-1/2 after:hidden after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100"
            >
            <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
                  <li className="flex items-center gap-2  rounded p-2">
                  <span className={`size-6 rounded-full  ${step == 1 ? 'bg-red-600' :'bg-gray-500'} text-center text-[10px]/6 font-bold text-white`}> 1 </span>

                  <span className="hidden sm:block">معلومات المصدر</span>
                  </li>

                  <li className="flex items-center gap-2  rounded p-2">
                  <span
                  className={`size-6 rounded-full  ${step == 2 ? 'bg-red-600' :'bg-gray-500'} text-center text-[10px]/6 font-bold text-white`}
                  >
                  2
                  </span>
                  <span className="hidden sm:block">معلومات الواحدات الدموية</span>
                  </li>
            </ol>
            </div>
            </div>
            <div className="w-full mt-10 p-6 bg-white rounded shadow">
      {step === 1 && (
      <>
            <h2 className="text-xl font-bold mb-4">أضافة معلومات المصدر</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                  <div className='flex flex-col gap-2'>
                        <label  for="source" required >المصدر</label>
                        <div>
                              <input
                              type="text"
                              id='source'
                              name="source"
                              placeholder="المصدر"
                              value={importData.source}
                              onChange={ (e)=> {setErrors({...erorrs,source:''});setImport({...importData,source:e.target.value})}}
                              className="w-full p-2 border border-gray-100 rounded"
                              />
                              {
                                    erorrs.source.trim() != '' ?
                                    <div className='text-sm text-red-500'>{erorrs.source}</div>
                                    :''
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
                              placeholder="تاريخ التوريد"
                              value={importData.importDate}
                              onChange={(e)=>{setErrors({...erorrs,importDate:''});setImport({...importData,importDate:e.target.value})}}
                              className="w-full p-2 border border-gray-100 rounded"
                              />
                              {
                                    erorrs.importDate.trim() != '' ?
                                    <div className='text-sm text-red-500'>{erorrs.importDate}</div>
                                    :''
                              }
                        </div>
                  </div>
            </div>
            <div className='flex justify-end my-4 gap-2'>  
                  <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                  <button
                  onClick={()=>handleNextStep()}
                  className="px-4 py-2 bg-[#82181A] text-white rounded hover:bg-red-800"
                  >
                  التالي
                  </button>
            </div>
      </>
      )}

      {step === 2 && (
      <>
            <h2 className="text-xl font-bold mb-4">معلومات  الوحدات الدموية</h2>
            <div className='flex flex-col gap-2'>
                  <div className='flex justify-end'>
                        <button onClick={addNewUnit} type="button" className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded '> عنصر جديد <i className='fa fa-add'></i></button>
                        
                  </div>
                  {
                        units.map((item,key)=>{
                              return <div key={key} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 border p-2 rounded border-gray-100'>
                                    
                                    <div className='flex flex-col gap-2'>
                                          <label for="bloodType" required>الزمرة الدموية</label>
                                          <div>
                                                
                                                <select
                                                type="text"
                                                id='bloodType'
                                                name="bloodType"
                                                placeholder="الزمرة الدموية"
                                                value={item.bloodType}
                                                onChange={(e)=>{handleChildError(key,'bloodType','');handleChildChange(key,e)}}
                                                className="w-full  p-2 border border-gray-100 rounded"
                                                >
                                                      <option value="">اختر الزمرة الدموية</option>      
                                                      <option value="A+">A+</option>      
                                                      <option value="A-">A-</option>      
                                                      <option value="B+">B+</option>      
                                                      <option value="B-">B-</option>      
                                                      <option value="AB+">AB+</option>      
                                                      <option value="AB-">AB-</option>      
                                                      <option value="O+">O+</option>      
                                                      <option value="O-">O-</option>      
                                                </select>

                                                {
                                                      unitErrors[key]?.bloodType?.trim() != '' ?
                                                      <div className='text-sm text-red-500'>{unitErrors[key]?.bloodType}</div>
                                                      :''
                                                }
                                          </div>

                                    </div>
                                    <div className='flex flex-col gap-2'>
                                          <label  for="type" required >نوع الوحدة</label>
                                          <div>
                                                <input
                                                type="text"
                                                id='type'
                                                name="type"
                                                placeholder="نوع الوحدة"
                                                value={item.type}
                                                onChange={ (e)=> {handleChildError(key,'type','');handleChildChange(key,e)}}
                                                className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                />
                                                {
                                                      unitErrors[key].type.trim() != '' ?
                                                      <div className='text-sm text-red-500'>{unitErrors[key].type}</div>
                                                      :''
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
                                                onChange={(e)=>{handleChildError(key,'volume','');handleChildChange(key,e)}}
                                                className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                />
                                                {
                                                      unitErrors[key].volume.trim() != '' ?
                                                      <div className='text-sm text-red-500'>{unitErrors[key].volume}</div>
                                                      :''
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
                                                onChange={(e)=>{handleChildError(key,'donationDate','');handleChildChange(key,e)}}
                                                className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                />
                                                {
                                                      unitErrors[key].donationDate.trim() != '' ?
                                                      <div className='text-sm text-red-500'>{unitErrors[key].donationDate}</div>
                                                      :''
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
                                                onChange={(e)=>{handleChildError(key,'expiredDate','');handleChildChange(key,e)}}
                                                className="w-full mb-3 p-2 border border-gray-100 rounded"
                                                />
                                                {
                                                      unitErrors[key].expiredDate.trim() != '' ?
                                                      <div className='text-sm text-red-500'>{unitErrors[key].expiredDate}</div>
                                                      :''
                                                }
                                          </div>
                                    </div>
                                    <div>
                                          
                                          <button onClick={()=>deleteUnit(key)} type="button" className='bg-red-600 p-2 hover:bg-red-800 text-white rounded '>
                                                <i class="fas fa-trash"></i>

                                          </button>
                                    </div>
                              </div>
                              
                        })
                  }
                  
            </div>
            <div className="flex justify-between my-4">
            <button
            onClick={()=>setSetp(p=>p-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
            رجوع
            </button>
            <div className='flex items-center gap-2'>
                  <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                  <button
                  disabled ={lodding}
                  onClick={handleSubmit}
                  className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#82181A] text-white rounded hover:bg-red-800"
                  >
                  حفظ البيانات
                  </button>
            </div>
            </div>
      </>
      )}
            </div>
      </div>
      
    </div>
  )
}

export default AddImport
