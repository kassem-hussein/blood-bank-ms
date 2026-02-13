/* eslint-disable */

import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const AddBloodUnit = () => {
 const [step,setSetp] = useState(1);
 const [lodding,setLodding] = useState(false)
 const [donorSearch, setDonorSearch] =useState(false)
 const navigate                      = useNavigate();
 const {token} = useSelector(state=>state.user);
 const [found ,setfound] = useState(false);
 const [erorrs,setErrors] =useState({
     donor_nationalityID:'',
     donor_DOB:'',
     donor_name:'' ,
     donor_bloodType:'',
     donor_phone:'',
     donor_email:'',
     unit_type:'',
     unit_volume:'',
     unit_donationDate:'',
     unit_expiredDate:''
 })
 const [donor,setDonor] = useState({
      id:'',
      nationalityID :'',
      name :'',
      bloodType:'',
      DOB:'',
      phone:'',
      email:'',
      qualified:1
 })
 const [unit,setUnit] =useState({
      type :'',
      volume:'',
      donationDate:'',
      expiredDate :'',
      donor_id:''
 }) 

 const hanaleDonorSearch =async ()=>{
      if(donor.nationalityID.trim() == ''){
            setDonor({
                  name : '',
                  email : '',
                  phone :'',
                  nationalityID : '',
                  DOB:'',
                  bloodType :'',
                  }) 
            setfound(false)
            return;
      }
      try{
            setDonorSearch(true)
            const response = await fetch(`${BASE_URL}/donors?nationalityID=${donor.nationalityID}&limit=1`,{
                  headers:{
                       'Accept':'application/json',
                       'Authorization':'Bearer '+token  
                  }
            })
            if(!response.ok){
                  toast.error(response.statusText);
            }else{
                  const resData = await response.json();
                  console.log(resData)
                  if(!resData.success){
                        toast.error(resData.message)
                  }else{
                        if(resData.data.length > 0){
                            setDonor({
                              id : resData.data[0].id,
                              name : resData.data[0].name,
                              email : resData.data[0].email,
                              phone : resData.data[0].phone,
                              DOB : resData.data[0].DOB,
                              nationalityID : resData.data[0].nationalityID,
                              bloodType : resData.data[0].bloodType,
                              qualified: resData.data[0].qualified
                            }) 
                            setfound(true) 
                        }else{
                              setDonor({
                              name : '',
                              email : '',
                              phone :'',
                              nationalityID : donor.nationalityID,
                              bloodType :'',
                              DOB:''
                            }) 
                            setfound(false) 
                        }
                  }
            }
            
      }catch(err){
            console.log(err)
      }finally{
            setDonorSearch(false)
      }
 }



 const handleNextStep =()=>{
      
      if(donor.nationalityID.trim() == ''){
            setErrors({...erorrs,donor_nationalityID:'حقل الرقم الوطني مطلوب'});
            return;
      }
      if(donor.name.trim() == ''){
            setErrors({...erorrs,donor_name:'حقل الاسم مطلوب'});
            return;
      }
      if(donor.bloodType.trim() == ''){
            setErrors({...erorrs,donor_bloodType:'حقل الزمرة الدموية مطلوب'});
            return;
      }
      if(donor.DOB.trim() == ''){
            setErrors({...erorrs,donor_bloodType:'حقل تاريخ الميلاد مطلوب'});
            return;
      }
      let bloodtypes =[
            'A+','A-','B+','B-','AB+','AB-','O+','O-'
      ];
      if(!bloodtypes.find((item=>item == donor.bloodType))){
            setErrors({...erorrs,donor_bloodType:'الزمرة الدموية يجب ان تكون من : A+,A-,B+,B-,AB+,AB-,O+,O-'});
            return;
      }
      if(donor.email.trim() == ''){
            setErrors({...erorrs,donor_email:'حقل البريد الالكتروني مطلوب'});
            return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(!emailRegex.test(donor.email)){
            setErrors({...erorrs,donor_email:'حقل البريد الالكتروني يحب ان يكون حقيقي'});
            return;
      }
      if(donor.phone.trim() == ''){
            setErrors({...erorrs,donor_phone:'حقل رقم الجوال مطلوب'});
            return;
      }
      const phonePattren = /^9\d{7}[0-9]$/;
      if(!phonePattren.test(donor.phone)){
            setErrors({...erorrs,donor_phone:'حقل الجوال يجب ان يتالف من تسعة ارقام ابتداً من 9 '});
            return;
      }

      setSetp(2)

 }

 const insertDonor = async()=>{
      if(donor.id) return donor.id
      const {id,qualified,...rest} = donor 
      try{
            const response = await fetch(`${BASE_URL}/donors`,{
                  method:'POST',
                  body:JSON.stringify(rest),
                  headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':'Bearer '+token,
                        'Access-Control-Allow-Origin':'*'
                  },
            })
            const resData = await response.json();
            console.log(resData)
            if(!response.ok){
                  toast.error(response.statusText)
                  setErrors({...erorrs,
                        donor_nationalityID: resData.errors?.nationalityID?.[0] || '',
                        donor_bloodType: resData.errors?.bloodType?.[0] || '',
                        donor_name : resData.errors?.name?.[0]   ||'',
                        donor_phone : resData.errors?.phone?.[0] || '',
                        donor_email : resData.errors?.email?.[0] || '',
                        donor_DOB : resData.errors?.DOB?.[0] || ''
                  })
                  setSetp(1)
                  return -1;
            }
            if(!resData.success) {
                  toast.error(resData)
                  setSetp(1);
                  return -1;
            };
            setDonor({...donor,id:resData.data.id})
            return resData.data.id

      }catch(err){
            console.log(err)
            return -1;
      }
 }

 const checkUnitData = ()=>{
      if(unit.type.trim() == ''){
            setErrors({...erorrs,unit_type:'حقل نوع الوحدة الدموية مطلوب'});
            return -1;
      }
      if(unit.volume.trim() == ''){
            setErrors({...erorrs,unit_volume:'حقل كمية الوحدة الدموية مطلوب'});
            return -1;
      }
      
      if(unit.donationDate.trim() == ''){
            setErrors({...erorrs,unit_donationDate:'حقل تاريخ انتهاء التبرع مطلوب'});
            return -1;
      }
      if(unit.expiredDate.trim() == ''){
            setErrors({...erorrs,unit_expiredDate:'حقل تاريخ انتهاء الصلاحية مطلوب'});
            return -1;
      }
  
 }

 const handleSubmit =async ()=>{
      setLodding(true);
      if(checkUnitData() == -1){
            setLodding(false);
            return;
      };
      let id =await insertDonor();
      console.log(id)
      if(id == -1){
            setLodding(false);
            return;
      };

      try{
            const response = await fetch(`${BASE_URL}/blood-units`,{
                  method:'POST',
                  headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':'Bearer '+token,
                        'Access-Control-Allow-Origin':'*'
                  },
                  body:JSON.stringify({...unit,donor_id:id})
            })
            const resData = await response.json();
            console.log(resData)
            if(!response.ok){
                  toast.error(response.statusText)
                  setErrors({...erorrs,
                        unit_type: resData.errors?.type?.[0] || '',
                        unit_doantionDate : resData.errors?.donatoionDate?.[0] || '',
                        unit_volume :resData.errors?.volume?.[0] || '',
                        unit_expiredDate:resData.errors?.expiredDate?.[0] || ''
                  })
                  return -1;
            }
            
            if(!resData.success){
                  toast.error(resData.message)
            }else{
                  toast.success(resData.message)
                  navigate('/blood-units')
            }
      }catch(err){
            console.log(err)
            return -1;
      }finally{
            setLodding(false);
      }

 }


  return (
    <div>
      <Breadcrumb items={[{label:'الوحدات الدموية',href:'/blood-units'},{label:'اضافة وحدة دموية',href:'/blood-units/new'}]}/>
      <div>
      <h2 className="sr-only">Steps</h2>

      <div
      className="relative w-[50%] mt-8 after:absolute after:inset-x-0 after:top-1/2 after:hidden after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100"
      >
      <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
            <li className="flex items-center gap-2  rounded p-2">
            <span className={`size-6 rounded-full  ${step == 1 ? 'bg-red-600' :'bg-gray-500'} text-center text-[10px]/6 font-bold text-white`}> 1 </span>

            <span className="hidden sm:block">معلومات المتبرع</span>
            </li>

            <li className="flex items-center gap-2  rounded p-2">
            <span
            className={`size-6 rounded-full  ${step == 2 ? 'bg-red-600' :'bg-gray-500'} text-center text-[10px]/6 font-bold text-white`}
            >
            2
            </span>

            <span className="hidden sm:block">معلومات الوحدة الدموية</span>
            </li>
      </ol>
      </div>
      </div>
      <div className="w-full mt-10 p-6 bg-white rounded shadow">
  {step === 1 && (
    <>
      <h2 className="text-xl font-bold mb-4">أضافة معلومات المتبرع</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
            <div className='flex flex-col gap-2'>
                  <label  for="nationalityID" required >الرقم الوطني</label>
                  <div>
                        <input
                        type="text"
                        id='nationalityID'
                        name="nationalityID"
                        placeholder="الرقم الوطني"
                        value={donor.nationalityID}
                        onChange={ (e)=> {setErrors({...erorrs,donor_nationalityID:''});setDonor({...donor,nationalityID:e.target.value})}}
                        onBlur={()=>hanaleDonorSearch()}
                        className="w-full p-2 border border-gray-100 rounded"
                        />
                        {
                              erorrs.donor_nationalityID.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.donor_nationalityID}</div>
                              :''
                        }
                        {
                              found &&  !donor.qualified  ?
                              <div className='text-sm text-red-500'>هذا المتبرع غير مؤهل للتبرع</div>
                              :''
                        }
                  </div>
            </div>
            <div className='flex flex-col gap-2'>
                  <label for="name" required>اسم المتبرع</label>
                  <div>
                        <input
                        type="text"
                        name="name"
                        id='name'
                        placeholder="اسم المتبرع"
                        value={donor.name}
                        disabled = {donorSearch}
                        onChange={(e)=>{setErrors({...erorrs,donor_name:''});setDonor({...donor,name:e.target.value})}}
                        className="w-full p-2 border border-gray-100 rounded"
                        />
                        {
                              erorrs.donor_name.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.donor_name}</div>
                              :''
                        }
                  </div>
            </div>
            <div className='flex flex-col gap-2'>
                  <label for="bloodType" required>الزمرة الدموية</label>
                  <div>
                        
                        <select
                        type="text"
                        id='bloodType'
                        name="bloodType"
                        placeholder="الزمرة الدموية"
                        value={donor.bloodType}
                        disabled ={donorSearch}
                        onChange={(e)=>{setErrors({...erorrs,donor_bloodType:''});setDonor({...donor,bloodType:e.target.value})}}
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
                              erorrs.donor_bloodType.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.donor_bloodType}</div>
                              :''
                        }
                  </div>

            </div>
            <div className='flex flex-col gap-2'>
                  <label for="email" required>البريد الالكتروني</label>
                  <div>
                        <input
                        type="email"
                        id='email'
                        name="email"
                        placeholder="البريد الالكتروني"
                        value={donor.email}
                        disabled = {donorSearch}
                        onChange={(e)=>{setErrors({...erorrs,donor_email:''});;setDonor({...donor,email:e.target.value})}}
                        className="w-full p-2 border border-gray-100 rounded"
                        />
                        {
                              erorrs.donor_email.trim() != ''?
                              <div className='text-sm text-red-500'>{erorrs.donor_email}</div>
                              :''
                        }
                  </div>
            </div>
            <div className='flex flex-col gap-2'>
                  <label for="phone" required>الجوال</label>
                  <div>
                               
                        <input
                        id='phone'
                        type="text"
                        name="phone"
                        placeholder="الجوال"
                        value={donor.phone}
                        disabled = {donorSearch}
                        onChange={(e)=>{setErrors({...erorrs,donor_phone:''});setDonor({...donor,phone:e.target.value})}}
                        className="w-full p-2 border  border-gray-100 rounded"
                        />
                        {
                              erorrs.donor_phone.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.donor_phone}</div>
                              :''
                        }
                  </div>
            </div>
            <div className='flex flex-col gap-2'>
                  <label for="DOB" required>تاريخ الميلاد</label>
                  <div>
                               
                        <input
                        id='DOB'
                        type="date"
                        name="DOB"
                        placeholder="تاريخ الميلاد"
                        value={donor.DOB}
                        disabled = {donorSearch}
                        onChange={(e)=>{setErrors({...erorrs,donor_DOB:''});setDonor({...donor,DOB:e.target.value})}}
                        className="w-full p-2 border  border-gray-100 rounded"
                        />
                        {
                              erorrs.donor_DOB.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.donor_DOB}</div>
                              :''
                        }
                  </div>
            </div>
      </div>
      <div className='flex justify-end mt-4'>      
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
      <h2 className="text-xl font-bold mb-4">معلومات  الوحدة الدموية</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
            <div className='flex flex-col gap-2'>
                  <label  for="type" required >نوع الوحدة</label>
                  <div>
                        <input
                        type="text"
                        id='type'
                        name="type"
                        placeholder="نوع الوحدة"
                        value={unit.type}
                        onChange={ (e)=> {setErrors({...erorrs,unit_type:''});setUnit({...unit,type:e.target.value})}}
                        className="w-full mb-3 p-2 border border-gray-100 rounded"
                        />
                         {
                              erorrs.unit_type.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.unit_type}</div>
                              :''
                        }
                  </div>

            </div>

            <div className='flex flex-col gap-2'>
                  <label for="volume" required>حجم الوحدة</label>
                  <div>
                        <input
                        type="number"
                        name="voulme"
                        id='volume'
                        placeholder="حجم الوحدة"
                        value={unit.volume}
                        onChange={(e)=>{setErrors({...erorrs,unit_volume:''});setUnit({...unit,volume:e.target.value})}}
                        className="w-full mb-3 p-2 border border-gray-100 rounded"
                        />
                         {
                              erorrs.unit_volume.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.unit_volume}</div>
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
                        value={unit.donationDate}
                        onChange={(e)=>{setErrors({...erorrs,unit_doantionDate:''});setUnit({...unit,donationDate:e.target.value})}}
                        className="w-full mb-3 p-2 border border-gray-100 rounded"
                        />
                         {
                              erorrs.unit_donationDate.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.unit_donationDate}</div>
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
                        value={unit.expiredDate}
                        onChange={(e)=>{setErrors({...erorrs,unit_expiredDate:''});setUnit({...unit,expiredDate:e.target.value})}}
                        className="w-full mb-3 p-2 border border-gray-100 rounded"
                        />
                         {
                              erorrs.unit_expiredDate.trim() != '' ?
                              <div className='text-sm text-red-500'>{erorrs.unit_expiredDate}</div>
                              :''
                        }
                  </div>
            </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={()=>setSetp(p=>p-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          رجوع
        </button>
        <button
          disabled ={lodding}
          onClick={handleSubmit}
          className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#82181A] text-white rounded hover:bg-red-800"
        >
          حفظ البيانات
        </button>
      </div>
    </>
  )}
</div>
      
    </div>
  )
}

export default AddBloodUnit
