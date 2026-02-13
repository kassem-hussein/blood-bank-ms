import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function ClientLayout() {
  const [open ,setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col transition-all">
      {/* Header */}
      <header className="bg-white sticky top-0  shadow">
        <div className="container mx-auto flex justify-between flex-wrap items-center py-4 px-6">
          <h1 className="text-xl font-bold">
            <img src="/logo.svg" alt="logo" className="w-6 h-6"/>
          </h1>
          <div className="hidden md:flex items-center flex-wrap  gap-2">
            <a href={'/'} className="text-gray-700 hover:text-red-600 font-medium px-3 py-2 transition-colors duration-200" >الرئيسية</a>
            <a href={'#project'} className="text-gray-700 hover:text-red-600 font-medium px-3 py-2 transition-colors duration-200" >تعريف المشروع</a>
            <a href={'#features'} className="text-gray-700 hover:text-red-600 font-medium px-3 py-2 transition-colors duration-200" >الميزات</a>
            <a href={'#ourteam'} className="text-gray-700 hover:text-red-600 font-medium px-3 py-2 transition-colors duration-200" >فريقنا</a>
          </div>
          <i onClick={()=>setOpen(prev=>!prev)} className="md:hidden fa fa-bars"></i>
        </div>       
        <nav class={`bg-white  border-b md:hidden overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-[100vh] py-4' : 'max-h-0'}  `}>
          
          <div class="px-4 pb-4 space-y-2">
            <a href="/" onClick={()=>setOpen(prev=>!prev)} to={"/"} class="block  p-2 text-gray-700 hover:text-red-600 font-medium">الرئيسية</a>
            <a href="/#project" onClick={()=>setOpen(prev=>!prev)} to={"#project"} class="block  p-2 text-gray-700 hover:text-red-600 font-medium">تعريف المشروع</a>
            <a href="/#features" onClick={()=>setOpen(prev=>!prev)} to={"#features"} class="block p-2  text-gray-700 hover:text-red-600 font-medium">ميزات المشروع</a>
            <a href="/#ourteam" onClick={()=>setOpen(prev=>!prev)} to={"#ourteam"} class="block p-2  text-gray-700 hover:text-red-600 font-medium">فريقنا</a>
            <a href="#" onClick={()=>setOpen(prev=>!prev)} to={"#"} class="block  p-2 text-gray-700 hover:text-red-600 font-medium">تواصل معنا</a>
            <div className="flex items-center justify-center gap-4">
              <Link to={'/check-blood'} className="flex-1 bg-white text-red-600 border border-red-400 px-4 py-2 rounded hover:bg-gray-100">
                  الاستعلامات
              </Link>
              <Link to={'/login'} className="flex-1 bg-red-600 border border-red-600   text-white hover:text-red-400 px-4 py-2 rounded hover:bg-gray-100">
                تسجيل دخول 
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <Outlet/>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} BBMS. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}