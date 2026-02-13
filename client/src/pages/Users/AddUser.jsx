import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const AddUser = () => {
  let object_schema  = {
      name:'',
      username:'',
      role:'',
      password:'',
      password_confirmation:''
  } 
  const [data,setData] = useState({...object_schema,role:'user'})
  const {token} = useSelector(state=>state.user);
  const [errors,setErrors] = useState({...object_schema});
  const [saving,setSaving] = useState(false);
  const navigate = useNavigate();

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
      
      let password_regux = /[A-Za-z0-9#@_&]{8,}/
      if(!password_regux.test(data.password)){
            errors.password = 'كلمة المرور يجب ان تحوي على احرف وارقام والرموز الخاصة @،_،&،&  بلغة الانجليزية'
            isPassed = false;
      }
      if(data.password.length < 8){
            errors.password = 'كلمة المرور يحب ان تكون على الاقل مكومة من مزيج 8 رموز'
            isPassed = false;
      }
      if(data.password == ''){
            errors.password = 'كلمة المرور مطلوبة '
            isPassed = false;
      }
      if(data.password_confirmation  == ''){
            errors.password_confirmation = 'تأكيد كلمة المرور مطلوب'
            isPassed = false;
      }
      if(data.password_confirmation != '' & data.password != data.password_confirmation){
            errors.password_confirmation = 'كلمة المرور وتاكيد كلمة المرور يجب ان يكون نفس الشيء'
            isPassed = false;
      }

      if(!isPassed) setErrors({...errors,temp_errors});
      return isPassed;

  }

  const handleSave = async ()=>{
      if(!isUserValid()) return;
      try{
            setSaving(true);
            const response = await fetch(`${BASE_URL}/users`,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                  },
                  body:JSON.stringify(data)
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
                        password:resData.errors?.password?.[0] || '',
                        password_confirmation:resData.errors?.password_confirmation?.[0] || '',
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
    <div className='p-4 '>
            {/* history */}
            <Breadcrumb items={[{label:'المستخدمين',href:'/users'},{label:'أضافة المستخدم',href:'#'}]}/>


            <div className='bg-white p-4 my-4 shadow-md rounded-md border-t border-gray-50 mt-8'>
                  <h2 className="text-xl font-bold mb-4" > <i className='fa fa-edit text-red-400'></i> أضافة  مستخدم</h2>
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
                                    <option value='user'>مستخدم</option>
                                    <option value='docotr'>طبيب</option>
                                    <option value='admin'>مدير</option>
                              </select>
                              {
                                    errors.role != ''?
                                    <div className='text-sm text-red-500'>{errors.role}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="password" required>كلمة المرور</label>
                              <input type="password"
                                name="password"
                                id='password'
                                value={data.password}
                                className='w-full mb-3 p-2 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,password:''}); setData({...data,password:e.target.value})}}
                              />
                              {
                                    errors.password != ''?
                                    <div className='text-sm text-red-500'>{errors.password}</div> :'' 
                              }
                        </div>
                        <div className='flex flex-col gap-1'>
                              <label for="password_confirmation" required>تأكيد كلمة المرور</label>
                              <input type="password"
                                name="password_confirmationn"
                                id='password_confirmation'
                                value={data.password_confirmation}
                                className='w-full mb-3 p-2 border border-gray-100 rounded'
                                onChange={(e)=>{setErrors({...errors,password_confirmation:''}); setData({...data,password_confirmation:e.target.value})}}
                              />
                              {
                                    errors.password_confirmation != ''?
                                    <div className='text-sm text-red-500'>{errors.password_confirmation}</div> :'' 
                              }
                        </div>
                  </div>
                  <div className='flex justify-end item-center my-4 gap-2'>
                  <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button onClick={handleSave} disabled={saving}  type="button" className='px-4 py-2 bg-[#82181A] text-white rounded  disabled:bg-gray-300 hover:bg-red-800'>حفظ البيانات</button>
                  </div>
            </div>
      
    </div>
  )
}

export default AddUser
