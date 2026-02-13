# متطلبات المشروع 
Composer
```bash
   https://getcomposer.org/download/
```
Node js 
```bash
   https://nodejs.org/dist/v22.18.0/node-v22.18.0-x64.msi
```
XAMPP 
```bash
  https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe
```
قم بالدخول الى المسار 
```bash
  C:\xampp\php # مسار الذي يحوي php in XAMPP
```
قم بالبحث عن الملف (PHP.ini) افتح الملف ب محرر النصوص وقم بالبحث عن extension=zip 
قم بحذف ";" ان وجد  في البداية لتفعيلها 


# كيف تشغيل المشروع

# الخطوة الاولى قم بفتح المكان المراد التنزيل الملفات فيه

```bash
      git clone https://github.com/kassem-hussein/blood-bank-ms.git
```
# الخطوة الثانية تهئية API
## 1- تغير المسار للمجلد  
```bash
      cd API
```
## 2- تنزيل  الحزم المطلوبة
تحقق من اداة تنزيل الحزم 'Compser' منزلة على جهازك 
```bash
      composer install
```
## 3- قم بتغير ملف .env.example to .env

## 4- قم بالاتصال بقاعدة البيانات الموجودة داخل XAMPP
تحقق من تنزيل XAMPP نسخة PHP 8.2 وقم بتفعيل zip extenstion 
## 5- توليد المفتاح الخاص بالتطبيق
```bash
   php artisan key:generate
```
## 6- انشاء جداول قاعدة البيانات
```bash
   php artisan migrate
```
## انشاء مستخدمين للتجريب
```bash
      php artisan db:seed
```
# تهئية Front-end
## 1- تغير المسار للمجلد  
```bash
      cd client
```
## 2- تنزيل الحزم المطلوبة 
تحقق ان nodejs (v22.18.0) مثبت لديك
```bash
      npm install
```
# تشغيل المشروع 
## قم بفتح نافذتين Terminal
### النافذ الاولى 
```bash
   cd API # تحقيق انك تعمل على المسار API
```
```bash
  php artisan serve
```

### النافذة الثانية
```bash
   cd client # تحقق ان تعمل على المسار المخصص للتطوير الواجهة الامامية 
```
```bash
  npm run dev
```




