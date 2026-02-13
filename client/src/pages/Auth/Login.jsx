import React from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../states/slices/UserSlice';
import { BASE_URL } from '../../Constrants/Constrant';

const Login = () => {
 let  fields = {
  username: '',
  password:''

 };
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const [data, setData] = useState(fields);
 const [lodding,setLodding] = useState(false);
 const [errors, setErrors] = useState({});

  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setData(prev => ({
      ...prev,
      [name]: value,
      }));
      };
  const renderError = (field) => {
      
      return errors[field]?.map((msg, i) => (
      <div key={i} className="text-sm text-red-500">{msg}</div>
      ));
  };


  const handleSubmit = async (event)=>{
     event.preventDefault();
     setLodding(true)
     try{
           const response =  await fetch(`${BASE_URL}/auth/login`,{
            method:'POST',
            headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin':'*'
            },
            body:JSON.stringify(data)
           });
           if (!response.ok) {
            const errorData = await response.json();
            setErrors(errorData.errors || {});
            console.log(errors)
          } else {
            const result = await response.json();
            // handle success
            if(result.success){
                  toast.success(result.message);
                  dispatch(login({user:result.user,token:result.token}))
                  navigate('/');
            }else{
                  toast.error(result.message);
            }
          }
     }catch(err){
            console.log("networking error: "+err);
     }finally{
            setLodding(false);
     }

 
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-start bg-[linear-gradient(90deg,#82181A_0%,#A40707_88%,#A40707_100%)]" dir="rtl">
      <div className='hidden md:flex bg-white p-4   shadow-md flex-col items-center w-[50%] h-[100vh] text-center pt-[64px]'>
        <h1 className='font-extrabold text-[2.2rem]'>أهلا وسهلاً بك في BBMS</h1>
        <img className='mt-[107px] ' src="logo.svg" width={292.93} height={268.92} alt="logo"/>
        <h2 className='font-extrabold text-[1.2rem] mt-[30px]'>BBMS</h2>
        <h2 className='font-blod text-[1.2rem] mt-[8px]'>نظام إدارة بنك الدم</h2>

      </div>
      <div className="bg-[#FDFBFB] p-8 rounded-[12px] shadow-md mx-auto min-w-md">
        <h1 className='font-blod text-[2rem] text-center'>مرحباً بك مجدداً</h1>
        <p className='font-medium text-[0.95rem] text-center mt-[0.5rem]'>قم بتسجيل الدخول بالأسفل من فضلك</p>
        <form onSubmit={(e)=>handleSubmit(e)} className='space-y-4 mt-[4.5rem] w-[300px] '>
          <div class="relative">

            <label class="absolute top-0 right-0 text-gray-600 text-sm">
              اسم المستخدم
            </label>

            <input 
              type="text" 
              value={data.username}
              name="username"
              onChange={handleChange}
              placeholder="ادخل اسم المستخدم...."
              class="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 mt-5"
            />
            {renderError('username')}
          </div>
          <div class="relative">

            <label class="absolute top-0 right-0 text-gray-600 text-sm">
             كلمة المرور
            </label>

            <input 
              type="password" 
              value={data.password}
              name="password"
              onChange={handleChange}
              placeholder="ادخل كلمة  المرور...."
              class="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 mt-5"
            />
            {renderError('password')}
          </div>
         
          <button
            type="submit"
            disabled={lodding}
            className={`${lodding ? ' bg-gray-400 text-white font-semibold py-2 px-4 rounded cursor-not-allowed opacity-70 w-full' : 'w-full bg-[#82181A] mt-[3.5rem] font-semibold text-white py-2 px-4 rounded hover:bg-red-700 transition'} `}
          >
            {
                  lodding?"....قيد المعالجة"
                  :"تسجيل دخول"
            }
          </button>
        </form>
       
      </div>
    </div>
       
    </>
  )
}

export default Login
