import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../states/slices/UserSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: 'fas fa-tachometer-alt', label: 'الرئيسية' ,href:'/'},
  { icon: 'fas fa-droplet', label: 'وحدات الدموية', href:'/blood-units'},
  { icon: 'fas fa-vial', label: 'التحاليل الطبية',href:'/tests' },
  { icon: 'fas fa-hand-holding-heart', label: 'المتبرعين' ,href:'/donors'},
  { icon: 'fas fa-file-export', label: 'الصادارات' ,href:'/exports'},
  { icon: 'fas fa-file-import', label: 'الورادات' ,href:'/imports'},
  { icon: 'fas fa-users', label: 'المستخدمين',href:'/users' },
];

const AsideBar = ({isOpen,setOpen}) => {
  
  const dispatch                = useDispatch();
  const navigate                = useNavigate();
  const {token} = useSelector(state=>state.user);

  const handleLogout = async()=>{
      try{
          const response =await fetch('http://127.0.0.1:8000/api/auth/logout',{
            method:'POST',
            headers:{
              'Authorization':'Bearer '+token,
              'Accept':'application/json'
            }
          })  
        
          const resData  = await response.json();
          if(!resData.success){
              toast.error(resData.message);
          }else{
            dispatch(logout());  
            toast.success(resData.message);
            navigate('/');
          }
      }catch(err){
        console.log("error :"+err);
      }
  }
  return (
    
    <div>
      {
        
          <aside
          className={` ${isOpen ? '': 'hidden'}  h-screen z-[999] shadow-lg fixed md:${isOpen ? ' fixed ':' sticky '} top-0 md:flex flex-col bg-white text-white transition-all duration-300 ${
            isOpen ? 'min-w-64' : 'w-16'
            
          } `}
        >
          <div
             onClick={()=>setOpen(i=>!i)}
            className="flex  items-center gap-2 text-black justify-center h-16 cursor-pointer"
          >
            {isOpen ?  <span><i className="text-gray-600 fa fa-home me-4"></i>لوحة التحكم</span> : <i className='text-gray-600 fa fa-home'></i>}
          </div>
      
          <div className="flex-1 flex flex-col items-between justify-between">
              <nav className="flex flex-col mt-4 px-4  space-y-2">
                {menuItems.map((item, index) => (
                  <a
                    title={!isOpen ? `${item.label}` : ''}
                    key={index}
                    href={item.href}
                    className="relative no-underline hover:no-underline flex text-black px-2 py-2 items-center  hover:bg-gray-50 rounded  group"
                  >
                    <span  className="text-sm text-gray-600">
                      <i  className={item.icon}></i>
                    </span>
                    <span
                      className={`mr-3 transition-opacity duration-200 ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                ))}
              <hr class="border border-gray-100 "/>
              <div className='flex flex-col justify-end items-center rounded'>
                <button
                  onClick={handleLogout}
                  title = {!isOpen ? 'نسجيل خروج':''}
                  className="relative no-underline rounded-lg w-full text-black  hover:no-underline flex  items-center px-2 py-2 hover:bg-gray-100 group"
                >
                  <span className="text-sm">
                    <i className='fa fa-sign-out'></i>
                  </span>
                  <span
                    className={`mr-3 transition-opacity font-medium duration-200 ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                  >
                    تسجيل خروج
                  </span>
                </button>
              </div>
              </nav>
          </div>          
        </aside> 
      }
    </div>
  );
};

export default AsideBar;







