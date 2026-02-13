import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { AddCard, Breadcrumb, InfoCard, Loader, Pagination } from '../../components';
import { BASE_URL } from '../../Constrants/Constrant';

const Users = () => {
  const [loadding,setLoadding]       = useState(false);
  const [data,setData]               = useState()
  const [search,setSearch]           = useState();
  const [dataInfo,setDataInfo]       = useState();
  const [searchBy,setSearchBy]       = useState();
  const [refresh,setRefresh]         = useState(1)
  const [sortConfig,setSortConfig]   = useState({key:'',direction:'asc'});
  const [currentPage,setCurrentPage] =useState(1);
  const {token,user}  =  useSelector(state=>state.user);
  const navigate = useNavigate();
  

  const fetchData = async ()=>{
      try{
        setLoadding(true);
        const response = await fetch(`${BASE_URL}/users?${searchBy}=${encodeURIComponent(search)}&page=${currentPage}`,{
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
              setData(resData.data);
              setDataInfo(resData);
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

  const requestSort = (key)=>{
    let direction = 'asc';
    if(sortConfig.key === key && sortConfig.direction === 'asc'){
          direction = 'desc';
    }
    setSortConfig({key,direction});
  }
  const getSortIcon = (key)=>{
    if(sortConfig.key !== key) return '⇅';
    return sortConfig.direction == 'asc'? '↑' :'↓';
  }

  let sortedData = [...data?.data || []].sort((a,b)=>{
      if(!sortConfig.key) return 0;
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if(aVal < bVal) return sortConfig.direction  === 'asc' ? -1 : 1;
      if(aVal > bVal) return sortConfig.direction  === 'asc' ? 1 :-1;
      return 0;
  })

   const handleDeleteItem =async (id,e)=>{
        let item = e.target.parentNode.parentNode;
        try{
        const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
        if(!confirmed) return;
        const response = await fetch(`${BASE_URL}/users/${id}`,{
              method:'DELETE',
              headers:{
              'Accept':'application/json',
              'Authorization':'Bearer '+token
              }
        })
        if(!response.ok) {
              toast.error(response.statusText)
        }else{
              const resData = await response.json();
              if(resData.success){

                    toast.success('تمت عملية الحذف بنجاح')
                    item.remove();
              }else{
              toast.error(resData.message);
              }
        }
  
        }catch(err){
        console.log(err)
        }
    }

  useEffect(()=>{
    fetchData();
  },[currentPage,refresh])

   const handleSearch = ()=>{
      setCurrentPage(1)
      setRefresh(p=>!p);
 }
 const clearFilter = ()=>{
      setSearchBy('');
      setSearch('');
      setCurrentPage(1)
      setRefresh(p=>!p)
 }


  return (
   loadding? <Loader/>  :  data ? <div className='p-6 space-y-6'>
        {/* history */}
            <Breadcrumb items={[{label:'المستخدمين',href:'/users'}]}/>

            {/* Header + Add Button */}
            <div className="flex gap-4 justify-center md:justify-start items-center flex-wrap md:flex-nowrap">

                <InfoCard title={' (المدراء)'} desc={'مدير'} number={dataInfo?.statistics?.admin_users} icon={'solar_user-bold.svg'} color={'red-900'}/>
                <InfoCard title={'(الاطباء)'} desc={'طبيب'} number={dataInfo?.statistics?.doctor_users} icon={'solar_user-bold.svg'}  color={'green-600'}/>
                <InfoCard title={' (مدخلي البيانات)'} desc={'مدخل بيانات'} number={dataInfo?.statistics.normal_users} icon={'solar_user-bold.svg'} color={'red-600'} />
                <AddCard to={'/users/new'} title={'اضافة مستخدم جديد'}/>
            
            </div>
            <div className='bg-white p-4 space-y-6 shadow-md rounded-md mt-8 border-t border-gray-50'>
                {/* Search Inputs */}
                <div className="grid grid-cols-4 gap-4">
                      <h2 className="text-xl font-semibold">المستحدمين</h2>
                      <select className='border border-gray-100 bg-gray-50 rounded' onChange={(e)=>setSearchBy(e.target.value)}>
                            <option value="">البحث بواسطة</option>
                            <option value="username" selected = {searchBy == 'username'}>اسم المستخدم</option>
                            <option value="role" selected ={searchBy == 'role'}>الصلاحية</option>
                      </select>
                      <div className='col-span-2 flex items-center gap-1'>
                            <input
                                  type='text'
                                  placeholder="البحث..."
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  className="px-3 w-full  py-2 bg-white border-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button onClick={()=>handleSearch()} type="button" className='bg-gray-50 border px-2 py-2 text-black rounded '><i className='fa fa-search'></i></button>
                            <button onClick={()=>clearFilter()} type="button" className='bg-gray-50 border px-2 py-2 text-black rounded '><i className='fas fa-times'></i></button>
                      </div>
                </div>
                {/* Table */}
                <div className="flex flex-col w-full h-full overflow-x-auto text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                      <table className="w-full text-left table-auto min-w-max">
                            <thead>
                                  <tr>
                                  <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('id')}>
                                  # {getSortIcon('id')}
                                  </th>
                                  <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('username')}>
                                  اسم المتسخدم {getSortIcon('username')}
                                  </th>
                                  <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('name')}>
                                  الاسم {getSortIcon('name')}
                                  </th>
                                  <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('role')}>
                                  الصلاحية  {getSortIcon('role')}
                                  </th>
                                  <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('created_at')}>
                                    تاريخ الانضمام (C) {getSortIcon('created_at')}
                                  </th>
                                  
                                  <th className="p-4 border-b border-slate-300 " >
                                  
                                  </th>
                                  </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-200">
                                  {sortedData?.map((item) => (
                                  <tr key={item.id} className="hover:bg-slate-50 transition">
                                  <td className="p-4 border-b border-slate-200">{item.id}</td>
                                  <td className="p-4 border-b border-slate-200">{item.username}</td>
                                  <td className="p-4 border-b border-slate-200">{item.name}</td>
                                  <td className="p-4 border-b border-slate-200">
                                    <span className={`${item.role =='admin' ? 'bg-blue-100 text-blue-600'
                                                      : item.role == 'doctor'? 'bg-green-100 text-green-600' 
                                                      : 'bg-red-100 text-red-600'
                                    } px-2 rounded-full `}>
                                        {
                                          item.role == 'admin' ? 'مدير' : item.role == 'doctor'?'طبيب' :'مدخل بيانات'
                                        }
                                    </span>
                                  </td>
                                  <td className="p-4 border-b border-slate-200">{item.created_at }</td>
                                  <td className="p-4 border-b border-slate-200">
                                        <i class="fa-solid fa-pen-to-square" onClick={()=>navigate(`/users/${item.id}/edit`)} title="Edit"></i>
                                        {
                                          user.id != item.id ?
                                          <i class="fa-solid fa-trash text-red-600" onClick={(e)=>handleDeleteItem(item.id,e)} title="Delete"></i>
                                          :''
                                        }
                                  </td>
                                  </tr>
                                  ))}
                            </tbody>
                      </table>
                </div>
                <Pagination dataInfo={dataInfo} fetchData={setCurrentPage}/>
              
            </div>
    </div> :<div>
      لا يوجد بيانات لعرضها
    </div>
  )
}

export default Users
