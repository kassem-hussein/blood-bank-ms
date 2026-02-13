import React, { useEffect, useState } from 'react'
import { AddCard, Breadcrumb, InfoCard, Loader, Pagination } from '../../components';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../Utils/RequestMessage';
import { BASE_URL } from '../../Constrants/Constrant';
const Donors = () => {
  const [data,setData] = useState();
  const [dataInfo,setDataInfo] = useState();
  const [loadding,setLoadding] = useState(false);
  const [search,setSearch]     = useState('');
  const [searchBy,setSearchBy] = useState('');
  const [currentPage,setCurrentPage] = useState(1);
  const [refetch,setRefetch] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate               = useNavigate()
  const {token } = useSelector(state=>state.user); 
  
 const fetchData =async()=>{
      try{
            setLoadding(true);
            const response = await fetch(`${BASE_URL}/donors?${searchBy}=${encodeURIComponent(search)}&page=${currentPage}`,{
                  headers:{
                        'Accept':'application/json',
                        'Authorization':'Bearer '+token
                  }
            })
            if(response.status >= 500){
                  navigate('/500')
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);                  
            }else if(response.ok){
                  const resData = await response.json();
                  if(resData.success){
                     setData(resData.data);  
                     setDataInfo(resData); 
                  }else{
                        toast.error(resData.message);
                  }

            }else{
                  toast.error(ErrorMessage.ANY)
            }


      }catch{
            navigate('/505')
      }finally{
            setLoadding(false);
      }
 }

 useEffect(()=>{
      fetchData();
 },[refetch,currentPage])

 const handleSearch = ()=>{
      setCurrentPage(1)
      setRefetch(p=>!p);
 }
 const clearFilter = ()=>{
      setSearchBy('');
      setSearch('');
      setCurrentPage(1)
      setRefetch(p=>!p)
 }

 const requestSort = (key)=>{
     let direction = 'asc';
     if(sortConfig.key === key && sortConfig.direction == 'asc'){
            direction = 'desc';
     }
     setSortConfig({key,direction});
 }
 
 const getSortIcon = (key)=>{
      if(sortConfig.key !== key) return '⇅'
      return  sortConfig.direction === 'asc' ?'↑' : '↓'
 }

 const sortedData = [...data?.data || []].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });



  const handleDeleteItem =async (id,e)=>{
      let item = e.target.parentNode.parentNode;
      try{
            const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
            if(!confirmed) return;
            const response = await fetch(`${BASE_URL}/donors/${id}`,{
              method:'DELETE',
              headers:{
                'Accept':'application/json',
                'Authorization':'Bearer '+token
              }
            })
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR)
                  navigate('/500')
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.ok){
                  const resData = await response.json();
                  if(resData.success){
                        toast.success(resData.message);
                        item.remove();
                  }else{
                        toast.error(resData.message);
                  }
            }else{
                  toast.error(ErrorMessage.ANY)
            }
      
      }catch{
            navigate('/500')
      }
  }


  



  return (
     loadding ? <Loader/> : data? <div className='p-6 space-y-6'>
            {/* Navigation History */}
            <Breadcrumb items={[{label:'المتبرعين',href:'/donors'}]}/>

            {/* Header + Add Button */}
            <div className="flex gap-4 justify-center md:justify-start items-center flex-wrap md:flex-nowrap">

            <InfoCard title={'العدد الكلي'} desc={'وحدة دموية'} number={dataInfo?.statistics?.donors} icon={'solar_user-bold.svg'} color={'red-900'}/>
            <InfoCard title={'الاشخاص المتبرعين'} desc={'وحدة دموية'} number={dataInfo?.statistics?.donated} icon={'check.svg'}  color={'green-600'}/>
            <InfoCard title={'الاشخاص الغير متبرعين '} desc={'وحدة دموية'} number={dataInfo?.statistics.non_donated} icon={'notallowed.svg'} color={'red-600'} />
            <AddCard to={'/donors/new'} title={'اضافة متبرع جديد'}/>
            
            </div>
            <div className='space-y-6 mt-4 border-t border-gray-50 bg-white shadow-md rounded p-4'>
                  {/* Search Inputs */}
                  <div className="grid grid-cols-4 gap-4">
                        <h2 className="text-xl font-semibold">المتبرعين</h2>
                        <select className='border border-gray-100 bg-gray-50 rounded' onChange={(e)=>setSearchBy(e.target.value)}>
                              <option value="">البحث بواسطة</option>
                              <option value="nationalityID" selected = {searchBy == 'nationalityID'}> الرقم الوطني</option>
                              <option value="blood" selected ={searchBy == 'blood'}>الفئة الدموية</option>
                              <option value="name" selected={ searchBy == 'name'}>الاسم</option>
                        </select>
                        <div className='col-span-2 flex items-center gap-1'>
                              <input
                                    type={searchBy == 'nationalityID'? 'number' : 'text'}
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
                  <thead className="">
                        <tr>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('id')}>
                        # {getSortIcon('id')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('nationalityID')}>
                        الرقم الوطني {getSortIcon('nationalityID')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('name')}>
                        الاسم {getSortIcon('name')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('BloodType')}>
                        الوحدة الدموية {getSortIcon('BloodType')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('email')}>
                        البريد الالكتروني {getSortIcon('email')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('phone')}>
                        رقم الجوال{getSortIcon('phone')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('lastDonation')}>
                        تاريخ  اخر تبرع {getSortIcon('lastDonation')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('donations')}>
                        عدد التبرعات {getSortIcon('donations')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('qualified')}>
                        الحالة   {getSortIcon('qualified')}
                        </th>
                        <th className="p-4 border-b border-slate-300 " >
                        
                        </th>
                        </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-200">
                        {sortedData?.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 border-b border-slate-200">{item.id}</td>
                        <td className="p-4 border-b border-slate-200">{item.nationalityID}</td>
                        <td className="p-4 border-b border-slate-200">{item.name}</td>
                        <td className="p-4 border-b border-slate-200">{item.bloodType}</td>
                        <td className="p-4 border-b border-slate-200">{item.email}</td>
                        <td className="p-4 border-b border-slate-200">{item.phone}</td>
                        <td className="p-4 border-b border-slate-200">{item.lastDonation || 'N/A'}</td>
                        <td className="p-4 border-b border-slate-200">{item.donations || 'N/A'}</td>
                        <td className='p-4 border-b border-slate-200'>
                              <span className={`${item.qualified ? 'bg-green-100 text-green-600' :'bg-red-100 text-red-600'} rounded-full px-2 `}> 
                                    {item.qualified ? "مؤهل" : 'غير مؤهل'}
                              </span>
                              </td>
                        <td className="p-4 border-b border-slate-200">
                              <i class="fa-solid fa-pen-to-square" onClick={()=>navigate(`/donors/${item.id}/edit`)} title="Edit"></i>
                              <i class="fa-solid fa-eye" onClick={()=>navigate(`/donors/${item.id}`)} title="Show"></i>
                              <i class="fa-solid fa-trash" onClick={(e)=>handleDeleteItem(item.id,e)} title="Delete"></i>
                        </td>
                        </tr>
                        ))}
                  </tbody>
                  </table>
                  </div>

                  {/* Pagination */}
                  <Pagination  dataInfo={dataInfo} fetchData={setCurrentPage}/>      
            </div>

    </div> :''
  )
}

export default Donors
