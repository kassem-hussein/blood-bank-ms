import React, { useEffect, useState } from 'react'
import { AddCard, Breadcrumb, InfoCard, Loader } from '../../components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ErrorMessage from '../../Utils/RequestMessage';
import Pagination from './../../components/Pagination';
import { BASE_URL } from '../../Constrants/Constrant';

const Exports = () => {
 const [loadding,setLoadding] = useState(false);
 const [data,setData] = useState();
 const [search,setSearch] =useState();
 const [searchBy,setSearchBy] = useState();
 const [refresh,setRefresh] =useState(1);
 const [dataInfo,setDataInfo] = useState();
 const navigate = useNavigate()
 const {token} = useSelector(state=>state.user);
 const [sortConfig,setSortConfig] = useState({key:'',direction:'asc'})
 const [currentPage ,setCurrentPage] = useState(1);
 const [pagination, setPagination] = useState({
      total :0,
      startIndex:0,
      endIndex:0
 })

 const fetchData = async ()=>{
      try{
            setLoadding(true);
            const URL = `${BASE_URL}/exports?${searchBy}=${encodeURIComponent(search)}&page=${currentPage}`;
            const response = await fetch(URL,{
                  headers:{
                        'Authorization':'Bearer '+token,
                        'Accept':'application/json'
                  }    
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.SERVER_ERROR);
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED);
            }else if(response.ok){
                  if(resData.success){
                        setData(resData.data);
                        setDataInfo(resData);
                        setPagination({
                              startIndex:resData.data.from,
                              endIndex:resData.data.to,
                              total:resData.data.total
                        })
                  }else{
                        toast.error(resData.message);
                  }
            }else{
                  toast.error(ErrorMessage.ANY);
            }
      }catch(err){
            console.log(err)
      }finally{
            setLoadding(false);
      }
 }

 useEffect(()=>{
      fetchData();
 },[currentPage,refresh])
 const requestSort =(key)=>{
      let direction = 'asc'
      if(sortConfig.key === key && sortConfig.direction == 'asc'){
            direction = 'desc';
      }
      setSortConfig({key,direction})
 }
 const getSortIcon =(key)=>{
      if(sortConfig.key !== key ) return '⇅';
      return sortConfig.direction === 'asc' ? '↑':'↓';
 }

 let sortedData = [...data?.data || []].sort((a,b)=>{
      if(!sortConfig.key) return 0;
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if(aVal < bVal) return sortConfig.direction === 'asc'?-1:1;
      if(aVal > bVal) return sortConfig.direction === 'asc'?1 :-1;
      return 0;
 })




 const handleDeleteItem =async (id,e)=>{
         let item = e.target.parentNode.parentNode;
         try{
         const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
         if(!confirmed) return;
         const response = await fetch(`${BASE_URL}/exports/${id}`,{
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
                     setPagination({...pagination,
                         endIndex : pagination.endIndex - 1, 
                         total    : pagination.total -1 
                     })
               }else{
               toast.error(resData.message);
               }
         }
   
         }catch(err){
         console.log(err)
         }
     }

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
   loadding? <Loader/> :data? <div className='p-6 space-y-6'>
            <Breadcrumb items={[{label:'الصادرات',href:'/exports'}]}/>
            <div className="flex gap-4 justify-center md:justify-start items-center flex-wrap md:flex-nowrap">

                  <InfoCard title={' الصادرات الكلية'} desc={'صادر'} number={dataInfo?.statistics?.exports} icon={'solar_user-bold.svg'} color={'red-900'}/>
                  <InfoCard title={'صادرات الشهر الحالي'} desc={'صادر'} number={dataInfo?.statistics?.month_exports} icon={'month.svg'}  color={'red-900'}/>
                  <InfoCard title={'صادرات السنة الحالية'} desc={'صادر'} number={dataInfo?.statistics?.year_exports} icon={'year.svg'}  color={'red-900'}/>
                  <AddCard to={'/exports/new'} title={'اضافة صادر جديد'}/>
            
            </div>
            <div className='bg-white border-t border-gray-50 p-4 shadow-md rounded mt-4 space-y-6'>
                  {/* Search Inputs */}
                  <div className="grid grid-cols-4 gap-4">
                        <h2 className="text-xl font-semibold">جميع الصادرات</h2>
                        <select className='border border-gray-100 bg-gray-50 rounded' onChange={(e)=>setSearchBy(e.target.value)}>
                              <option value="">البحث حسب</option>
                              <option value="export_date" selected = {searchBy == 'export_date'}>تاريخ التصدير</option>
                              <option value="destenation" selected ={searchBy == 'destenation'}>الوجهة</option>
                              
                        </select>
                        <div className='col-span-2 flex items-center gap-1'>
                              <input
                                    type={searchBy == 'export_date'? 'date' : 'text'}
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
                              <thead className="bg-gradient-to-r from-red-100 to-red-200">
                                    <tr>
                                    <th className="p-4 border-b border-slate-300 bg-slate-50" onClick={() => requestSort('id')}>
                                    # {getSortIcon('id')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 bg-slate-50" onClick={() => requestSort('destenation')}>
                                          الجهة {getSortIcon('destenation')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 bg-slate-50" onClick={() => requestSort('exportDate')}>
                                          تاريخ التصدير {getSortIcon('exportDate')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 bg-slate-50" >
                                    
                                    </th>
                                    </tr>
                              </thead>
                              <tbody className="text-sm divide-y divide-gray-200">
                                    {sortedData?.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                          <td className="p-4 border-b border-slate-200">{item.id}</td>
                                          <td className="p-4 border-b border-slate-200">{item.destenation}</td>
                                          <td className="p-4 border-b border-slate-200">{item.exportDate }</td>
                                          <td className="p-4 border-b border-slate-200">
                                                <i class="fa-solid fa-pen-to-square" onClick={()=>navigate(`/exports/${item.id}/edit`)} title="Edit"></i>
                                                <i class="fa-solid fa-eye"  onClick={()=>navigate(`/exports/${item.id}`)} title="Show"></i>
                                                <i class="fa-solid fa-trash text-red-500" onClick={(e)=>handleDeleteItem(item.id,e)} title="Delete"></i>
                                          </td>
                                    </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
                  <Pagination dataInfo={dataInfo} fetchData={setCurrentPage}/>
            </div>


    </div> : <div>
            لا يوجد بيانا لعرضها
    </div>
  )
}

export default Exports
