import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Loader } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const EditUser = () => {
  let object_schema  = {
      name:'',
      username:'',
      role:'',
  } 
  const [data,setData] = useState({...object_schema,role:'user'})
  const {token} = useSelector(state=>state.user);
  const params = useParams();
  const [errors,setErrors] = useState({...object_schema});
  const [saving,setSaving] = useState(false);
  const [loadding,setLoadding] = useState(false);
  const navigate = useNavigate();

  

  const fetchData = async ()=>{
      try{
        setLoadding(true);
        const response = await fetch(`${BASE_URL}/users/${params.id}`,{
          headers:{
            'Accept':'application/json',
            'Authorization':'Bearer '+token
          }
        })
        const resData = await response.json();
        
        switch(response.status){
          case 500: toast.error(ErrorMessage.SERVER_ERROR) ;break;
          case 401: toast.error(ErrorMessage.AUNTHORIZED);break;
          case 403: toast.error(ErrorMessage.AUNTHORIZED);break;
        }
        if(response.ok){
          if(resData.success){
              setData({
                  username: resData.data?.username || '',
                  role :resData.data?.role || '',
                  name :resData.data?.name || '' 
              });
              
          }else{
            toast.error(resData.message);
          }
        }
      }catch(err){
        toast.error(err.message);
      }finally{
        setLoadding(false);
      }
  }

  useEffect(()=>{
      fetchData();
  },[])

  const isUserValid = ()=>{
      let temp_errors ={}
      let isPassed = true;
      if(data.username.length < 6){
            errors.username = 'يجب ان يكون يتألف اسم المستخدم من 6 حروف او ارقام او حروف خاصة '
            isPassed = false;
      }
       let username_regux = /[A-Za-z0-9_]/
      if(!username_regux.test(data.username)){
            errors.username = 'اسم المستخدم يجب ان يحوي على حروف أو ارقام او _ بالغة الانجليزية فقط'
            isPassed = false;
      }
      if(data.username == ''){
            errors.username = 'اسم المستخدم مطلوب'
            isPassed = false;
      }
      if(data.name == ''){
            errors.name = 'الاسم مطلوب'
            isPassed =false;
      }
      let roles = ['doctor','admin','user'];
      if(!roles.find(r=>r == data.role)){
            errors.role = 'الرجاء اختيار الصلاحية '
            isPassed = false;
      }


      if(!isPassed) setErrors({...errors,temp_errors});
      return isPassed;

  }

  const handleSave = async ()=>{
      if(!isUserValid()) return;
      try{
            setSaving(true);
            const response = await fetch(`${BASE_URL}/users/${params.id}`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify({...data,_method:'PUT'})
            })
            const resData =await response.json();
            switch(response.status){
                  case 500: toast.error(ErrorMessage.SERVER_ERROR) ;break;
                  case 401: toast.error(ErrorMessage.AUNTHORIZED);break;
                  case 403: toast.error(ErrorMessage.AUNTHORIZED);break;
                  
            }
            if(response.status == 422){
                  setErrors({...errors,
                        username:resData.errors?.username?.[0] || '',
                        name : resData.errors?.name?.[0] || '',
                        role: resData.errors?.role?.[0] || '',
                  })
            }
            if(response.ok){
                  if(resData.success){
                        toast.success(resData.message);
                        navigate('/users')
                  }else{
                        toast.error(resData.message);
                  }
            }
      }catch(err){
            toast.error(err.message);
      }finally{
            setSaving(false);
      }
  }
  return (
     loadding ?<Loader/> : data.username ? <div className='p-4'>
            {/* history */}
            <Breadcrumb items={[{label:'المستخدمين',href:'/users'},{label:'تعديل مستخدم',href:'#'}]}/>
            <div className='bg-white p-4 my-8 rounded-md shadow-md border-t border-gray-50 mt-8'>
                  <h2 className="text-xl font-bold my-4" > <i className='fa fa-edit text-red-400'></i> تعديل  مستخدم</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='flex flex-col gap-1'>
                              <label for="username" required>اسم المتسخدم</label>
                              <input type="text"
                                name="username"
                                id='username'
                                value={data.username}
                                className='w-full mb-3 p-2 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,username:''}); setData({...data,username:e.target.value})}}
                              />
                              {
                                    errors.username != ''?
                                    <div className='text-sm text-red-500'>{errors.username}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="name" required>الاسم</label>
                              <input type="text"
                                name="name"
                                id='name'
                                value={data.name}
                                className='w-full mb-3 p-2 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,name:''}); setData({...data,name:e.target.value})}}
                              />
                              {
                                    errors.name != ''?
                                    <div className='text-sm text-red-500'>{errors.name}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="role" required>الصلاحية</label>
                              <select 
                                name="role"
                                id='role'
                                className='w-full mb-3 p-1 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,role:''}); setData({...data,role:e.target.value})}}
                              >
                                    <option value='user' selected= {data.role == 'user'}>مستخدم</option>
                                    <option value='docotr' selected={data.role == 'doctor'}>طبيب</option>
                                    <option value='admin' selected={data.role == 'admin'}>مدير</option>
                              </select>
                              {
                                    errors.role != ''?
                                    <div className='text-sm text-red-500'>{errors.role}</div> :'' 
                              }
                        </div>
                  </div>
                  <div className='flex justify-end item-center my-4 gap-2'>
                        <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button onClick={handleSave} disabled={saving}  type="button" className='p-2 bg-[#82181A] text-white rounded  disabled:bg-gray-300 hover:bg-red-800'>حفظ البيانات</button>
                  </div>
            </div>
      
    </div> : <div>
            لا يوجد بيانات لعرضها
    </div>
  )
}

export default EditUser
