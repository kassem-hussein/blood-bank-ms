import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../states/slices/UserSlice";
import { BASE_URL } from "../Constrants/Constrant";


const userMenuItem =  [
  { icon: 'fas fa-tachometer-alt', label: 'الرئيسية' ,href:'/'},
  { icon: 'fas fa-droplet', label: 'وحدات الدموية', href:'/blood-units'},
  { icon: 'fas fa-hand-holding-heart', label: 'المتبرعين' ,href:'/donors'},
  { icon: 'fas fa-file-export', label: 'الصادارات' ,href:'/exports'},
  { icon: 'fas fa-file-import', label: 'الورادات' ,href:'/imports'},

];
const doctorMenuItem = [
  { icon: 'fas fa-tachometer-alt', label: 'الرئيسية' ,href:'/'},
  { icon: 'fas fa-vial', label: 'التحاليل الطبية',href:'/tests' },
]

const adminMenuItem = [
  { icon: 'fas fa-tachometer-alt', label: 'الرئيسية' ,href:'/'},
  { icon: 'fas fa-droplet', label: 'وحدات الدموية', href:'/blood-units'},
  { icon: 'fas fa-vial', label: 'التحاليل الطبية',href:'/tests' },
  { icon: 'fas fa-hand-holding-heart', label: 'المتبرعين' ,href:'/donors'},
  { icon: 'fas fa-file-export', label: 'الصادارات' ,href:'/exports'},
  { icon: 'fas fa-file-import', label: 'الورادات' ,href:'/imports'},
  { icon: 'fas fa-users', label: 'المستخدمين',href:'/users' },
];


export default function Aside({open}) {
  const dispatch                = useDispatch();
  const navigate                = useNavigate();
  const {token,user} = useSelector(state=>state.user);
  const menuItems = user.role == 'admin' ?adminMenuItem : user.role =='doctor'? doctorMenuItem : userMenuItem;

  const handleLogout = async()=>{
      
      try{
          const response =await fetch(`${BASE_URL}/auth/logout`,{
            method:'POST',
            headers:{
              'Authorization':'Bearer '+token,
              'Accept':'application/json'
            }
          })  
        
          const resData  = await response.json();
          if(response.status == 401 || response.status == 403){
            dispatch(logout())
          }
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
    <div className="flex h-screen bg-gray-100 sticky top-0 ">
      {/* Desktop Aside */}
      <aside className="hidden md:flex md:w-64 bg-white shadow-lg flex-col overflow-y-scroll hide-scrollbar">
        {/* Header */}
        <div className="p-4 text-xl text-center font-bold flex flex-col items-center justify-center">
          <img src="/logo.svg" alt="logo" className="w-16 h-16"/>
          <h1 className="text-[1.2rem] font-medium ">BBMS</h1>
        </div>


        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
            >
              <i className={`${item.icon} ml-3`}></i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

      {/* User Details Box */}
      <div className="mx-4 mb-4 bg-gray-50 rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          {/* Avatar placeholder */}
          <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full font-bold">
            {user.username.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.role}</p>
          </div>
        </div>

        {/* Change Password Link */}
        <div className="mt-3">
          <a
            href="/change-password"
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            تغيير كلمة المرور
          </a>
        </div>
      </div>


        {/* Footer */}
        <div className="p-4 border-t">
          <button onClick={()=>handleLogout()} className="flex items-center w-full px-3 py-2 rounded bg-[#82181A] text-white hover:bg-red-700">
            <i className="fas fa-sign-out-alt ml-3"></i>
            تسجيل خروج
          </button>
        </div>
      </aside>

      {/* Mobile Aside */}
      {open && (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="p-4 text-xl text-center font-bold border-b">BBMS</div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
              >
                <i className={`${item.icon} ml-3`}></i>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
          
           {/* User Details Box */}
          <div className="mx-4 mb-4 bg-gray-50 rounded-lg shadow p-4">
            <div className="flex items-center gap-2">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full font-bold">
                {user.username.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
            </div>

            {/* Change Password Link */}
            <div className="mt-3">
              <a
                href="/change-password"
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                تغيير كلمة المرور
              </a>
            </div>
          </div>
          

          {/* Footer */}
          <div className="p-4 border-t">
            <button onClick={()=>handleLogout()} className="flex items-center w-full px-3 py-2 rounded bg-[#82181A] text-white hover:bg-red-700">
              <i className="fas fa-sign-out-alt ml-3"></i>
              تسجيل خروج
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}