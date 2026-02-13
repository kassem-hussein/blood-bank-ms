import React from "react";
import { Link } from "react-router-dom";

export default function ClientHome() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 min-h-[100vh] flex-1 flex items-center justify-center text-center py-20">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            نظام ادارة بنك الدم المتقدم
          </h2>
          <p className="text-gray-600 mb-6">
             نظام إدارة بنك الدم حل تقني لادارة المتبرعين والوحدات الدموية والصادارات والواردات بالاضافة الى ادارة المستخدمين والصلاحيات والتحاليل الخاصة بالواحدات الدموية 
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to={'/check-blood'} className="bg-white text-red-600 border border-red-400 px-4 py-2 rounded hover:bg-gray-100">
               الاستعلامات
            </Link>
            <Link to={'/login'} className="bg-red-600 border border-red-600   text-white hover:text-red-400 px-4 py-2 rounded hover:bg-gray-100">
              تسجيل دخول 
            </Link>
          </div>
        </div>
        <div>
          
        </div>
        
      </section>

       {/* Project Defintion */}

      <section id="project" class="bg-white py-12 min-h-[100vh]">
        <div class="max-w-5xl mx-auto px-6">
          
          <h2 class="text-3xl font-bold text-gray-800 mb-4">نظام ادارة بنك الدم</h2>
          
         
          <p class="text-gray-600 mb-8">
            حل تقني شامل لادارة بنوك الدم واتمتة العمليات الورقية وسرعة البحث عن المعلومات والتكامل بين الوحدات المختلفة 
          </p>

         
          <div>
            <h3 class="text-2xl font-semibold text-gray-700 mb-6">التقنيات المستخدمة</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              
             
              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" 
                    alt="Figma" class="w-10 h-10 mb-2"/>
                <span class="text-sm font-medium text-gray-800">Figma</span>
              </div>

              
              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" 
                  alt="Laravel" class="w-10 h-10 mb-2"/>

                <span class="text-sm font-medium text-gray-800">Laravel</span>
              </div>

            
              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" 
                    alt="Postman" class="w-10 h-10 mb-2"/>
                <span class="text-sm font-medium text-gray-800">Postman</span>
              </div>

              
              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" 
                    alt="PHP" class="w-10 h-10 mb-2"/>
                <span class="text-sm font-medium text-gray-800">PHP</span>
              </div>

              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
                    alt="React" class="w-10 h-10 mb-2"/>
                <span class="text-sm font-medium text-gray-800">React.js</span>
              </div>

              
              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://vitejs.dev/logo.svg" 
                    alt="Vite" class="w-10 h-10 mb-2"/>
                <span class="text-sm font-medium text-gray-800">Vite.js</span>
              </div>

            
              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" 
                  alt="Tailwind CSS" class="w-10 h-10 mb-2"/>

                <span class="text-sm font-medium text-gray-800">Tailwind CSS</span>
              </div>

           
              <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                <img src="https://www.svgrepo.com/show/306995/xampp.svg" 
       alt="XAMPP" class="w-10 h-10 mb-2"/>



                <span class="text-sm font-medium text-gray-800">XAMPP</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            ميزات نظام ادارة بنك الدم
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border rounded shadow hover:shadow-lg">
              <i class="fas fa-chart-bar text-blue-600 text-2xl"></i>
              <h4 className="text-lg font-semibold mb-2">الاحصائيات</h4>
              <p className="text-gray-600">
                الحصول على الاحصائيات المستمرة للمتبرعين وحالات التبرع والصادرات والواردات
              </p>
            </div>
            <div className="p-6 bg-white border rounded shadow hover:shadow-lg">
              <i class="fas fa-hand-holding-heart text-green-600 text-2xl"></i>
              <h4 className="text-lg font-semibold mb-2"> ادارة المتبرعين</h4>
              <p className="text-gray-600">
                القدرة على ادارة المتبرعين من علميات اضافة وتعديل وحذف متبرع
              </p>
            </div>
            <div className="p-6 bg-white border rounded shadow hover:shadow-lg">
              <i class="fas fa-cubes text-purple-600 text-2xl"></i>
              <h4 className="text-lg font-semibold mb-2">ادارة الوحدات الدموية</h4>
              <p className="text-gray-600">
                القدرة على ادارة الوحدات الدموية من عمليات اضافة وتعديل وحذف الوحدات الدموية
              </p>
            </div>
            <div className="p-6 bg-white border rounded shadow hover:shadow-lg">
              <i class="fas fa-arrow-up text-indigo-600 text-2xl"></i>
              <h4 className="text-lg font-semibold mb-2">ادارة الصادرات الدموية</h4>
              <p className="text-gray-600">
                القدرة على ادارة الصادرات الدموية من عمليات اضافة وتعديل وحذف الصادرات الدموية
              </p>
            </div>
            <div className="p-6 bg-white border rounded shadow hover:shadow-lg">
              <i class="fas fa-arrow-down text-red-600 text-2xl"></i>
              <h4 className="text-lg font-semibold mb-2">ادارة الواردات الدموية</h4>
              <p className="text-gray-600">
                القدرة على ادارة الواردات الدموية من عمليات اضافة وتعديل وحذف الواردات الدموية
              </p>
            </div>
            <div className="p-6 bg-white border rounded shadow hover:shadow-lg">
              <i class="fas fa-tint text-red-600 text-2xl"></i>
              <h4 className="text-lg font-semibold mb-2">ادارة التحاليل الدموية</h4>
              <p className="text-gray-600">
                القدرة على ادارة التحاليل الدموية للوحدات الدموية من عمليات اضافة وتعديل وحذف للتحاليل الدموية
              </p>
            </div>
            <div className="p-6 bg-white border rounded shadow hover:shadow-lg">
              <i class="fas fa-users text-gray-600 text-2xl"></i>
              <h4 className="text-lg font-semibold mb-2">ادارة المستخدمين </h4>
              <p className="text-gray-600">
                القدرة على ادارة المستخدمين من عمليات اضافة وتعديل وحذف ادارة المستخدمين
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section id="ourteam" className="py-16 bg-gray-50 bg-white min-h-[100vh]">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
             فريقنا
          </h3>
          <div className="p-6 my-4 py-10 border-t border-gray-50 bg-gray-50 rounded shadow">
            <i class="fas fa-user-tie text-blue-600 text-2xl"></i> 
            <h4 className="text-lg font-semibold">د.محمد الشايطة</h4>
            <p className="text-gray-600">Project Supervisor | مشرف المشروع</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 py-10 bg-gray-50 rounded shadow">
              <i class="fas fa-database text-indigo-600 text-2xl"></i>
              <h4 className="text-lg font-semibold">قاسم حسين</h4>
              <p className="text-gray-600">Back-end Developer | مطور الواجهة الخلفية</p>
            </div>
            <div className="p-6 py-10 bg-gray-50 rounded shadow">
              <i class="fas fa-code text-green-600 text-2xl"></i>
              <h4 className="text-lg font-semibold">سيدره القدة</h4>
              <p className="text-gray-600">Front-end Developer | مطورة الواجهة الامامية</p>
            </div>
            <div className="p-6 py-10 bg-gray-50 rounded shadow">
              <i class="fas fa-pencil-ruler text-pink-600 text-2xl"></i>
              <h4 className="text-lg font-semibold">أحمد الطويل</h4>
              <p className="text-gray-600">UI/UX Designer | مصمم الواجهات الامامية</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}