import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ErrorMessage from '../../Utils/RequestMessage'
import { useNavigate } from 'react-router-dom'
import { Breadcrumb } from '../../components'
import { BASE_URL } from '../../Constrants/Constrant'

const ChangePassword = () => {
  const schema = {
      old_password:'',
      new_password:'',
      new_password_confirmation:''
  }
  const [data,setData] = useState({...schema})
  const [errors,setErrors]= useState({...schema})
  const [saving,setSaving] = useState(false);
  const {token} = useSelector(state=>state.user);
  const navigate = useNavigate();

  const isInputsValid =()=>{
      let isPassed = true
      let temp_errors = {};
      if(data.old_password == ''){
            temp_errors.old_password = 'كلمة المرور  القديمة مطلوبة'
            isPassed= false;
      }
      let regux_password =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if(!regux_password.test(data.new_password)){
            temp_errors.new_password = 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وتتضمن حرفًا واحدًا على الأقل، ورقمًا واحدًا، ورمزًا خاصًا مثل (@، $، !، %، *، ؟، &).'
            isPassed =false;
      }
      if(data.new_password_confirmation != data.new_password){
            temp_errors.new_password_confirmation = 'حقل كلمة المرور وتأكيده يجب ان  يتطابقان'
            isPassed =false;
      }
      if(data.new_password_confirmation == ''){
            temp_errors.new_password_confirmation = 'تأكيد كلمة المرور متطلوب'
            isPassed = false;
      }
      setErrors(temp_errors);
      return isPassed;

  }
  const handleSave = async ()=>{
      if(!isInputsValid()) return;
      try{
            setSaving(true);
            const response = await fetch(`${BASE_URL}/auth/change-password` ,{
                  method:'POST',
                  headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token
                        
                  },
                  body:JSON.stringify(data)
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR)
                  
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED)
            }else if(response.status == 422){
                  setErrors({...errors,
                        old_password:resData?.errors?.old_password?.[0] || '',
                        new_password:resData?.errors?.new_password?.[0] || '',
                        new_password_confirmation:resData?.errors?.new_password_confirmation?.[0] || '',
                  })
            }else if(response.ok){
                  if(resData.success){
                        toast.success(resData.message)
                        navigate('/')
                  }else{
                        toast.error(resData.message)
                  }
            }else{
                  toast.error(ErrorMessage.ANY)
            }

      }catch(err){
            toast.error(err)
      }finally{
            setSaving(false);
      }

  }


  return (
    <div className='p-4'>
            {/* Navigation History */}
            <Breadcrumb items={[{label:'تغير كلمة المرور',href:'/change-password'}]}/>
            <div className='w-full mt-10 p-6 bg-white rounded shadow'>
                  <h2 className="text-xl font-bold mb-4">تغير كلمة المرور</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                        <div className='flex flex-col gap-2'>
                              <label  for="old_password" required >كلمة المرور القديمة</label>
                              <div>
                                    <input
                                    type="password"
                                    id='old_password'
                                    name="old_password"
                                    value={data.old_password}
                                    onChange={ (e)=> {setErrors({...errors,old_password:''});setData({...data,old_password:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />
                                    {
                                          errors.old_password != '' ?
                                          <div className='text-sm text-red-500'>{errors.old_password}</div>
                                          :''
                                    }
                              </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                              <label  for="new_password" required >كلمة المرور الجديدة</label>
                              <div>
                                    <input
                                    type="password"
                                    id='new_password'
                                    name="new_password"
                                    value={data.new_password}
                                    onChange={ (e)=> {setErrors({...errors,new_password:''});setData({...data,new_password:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />
                                    {
                                          errors.new_password != '' ?
                                          <div className='text-sm text-red-500'>{errors.new_password}</div>
                                          :''
                                    }
                              </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                              <label  for="new_password_confirmation" required > تأكيد  كلمة المرور الجديدة </label>
                              <div>
                                    <input
                                    type="password"
                                    id='new_password_confirmation'
                                    name="new_password_confirmation"
                                
                                    value={data.new_password_confirmation}
                                    onChange={ (e)=> {setErrors({...errors,new_password_confirmation:''});setData({...data,new_password_confirmation:e.target.value})}}
                                    className="w-full p-2 border border-gray-100 rounded"
                                    />
                                    {
                                          errors.new_password_confirmation != '' ?
                                          <div className='text-sm text-red-500'>{errors.new_password_confirmation}</div>
                                          :''
                                    }
                              </div>
                        </div>
                       
                  </div>
                  <div className='flex justify-end my-4 items-center gap-2'>
                        <button onClick={()=>navigate(-1)} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 border border-red-500 bg-red-100 text-red-500 rounded hover:bg-red-600 hover:text-white transition'>الغاء وعودة</button>
                        <button onClick={()=>handleSave()} disabled={saving} type="button" className='disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#82181A] hover:bg-red-800 text-white px-4 py-2 rounded'>حفظ البيانات</button>
                  </div>
            
            </div>
      
    </div>
  )
}

export default ChangePassword
