import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorMessage from '../../Utils/RequestMessage';
import { AddCard, Breadcrumb, InfoCard, Loader, Pagination } from '../../components';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../Constrants/Constrant';

const Imports = () => {
  const [data,setData]                = useState();
  const [dataInfo,setDataInfo]        = useState();
  const [search,setSearch]            = useState();
  const [searchBy,setSearchBy]        = useState();
  const [refresh,setRefresh]          = useState(1);
  const [loadding,setLoadding]        = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate                      = useNavigate()
  const [pagination,setPagination]    = useState({
      total:0,
      startIndex:0,
      endIndex:0
  });
  const [sortConfig,setSortConfig]    = useState({key:'',direction:'asc'})
  const {token}                       = useSelector(state=>state.user);

  const requestSort = (key)=>{
      let direction = 'asc'
      if(sortConfig.key === key && sortConfig.direction == 'asc'){
            direction ='decs'
      } 
      setSortConfig({key,direction})
  }

  const getSortIcon = (key)=>{
      if(sortConfig.key !== key) return '⇅';
      return sortConfig.direction == 'asc' ? '↑' : '↓'; 
  }


  const sortedData = [...data?.data || []].sort((a,b)=>{
      if(sortConfig.key == '') return 0;
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if(aVal < bVal) return sortConfig.direction == 'asc' ? -1 :1;
      if(aVal > bVal) return sortConfig.direction == 'asc' ?  1: -1;
      return 0;
  })

  const fetchData =async ()=>{
      try{
            setLoadding(true);
            const response = await fetch(`${BASE_URL}/imports?${searchBy}=${encodeURIComponent(search)}&page=${currentPage}`,{
                  headers:{
                        'Accept':'application/json',
                        'Authorization':'Bearer '+token
                  }
            })
            const resData = await response.json();
            if(response.status >= 500){
                  toast.error(ErrorMessage.AUNTHORIZED)
            }else if(response.status == 401 | response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED)
            }else if(response.ok){
                  if(resData.success){
                        setData(resData.data);
                        setDataInfo(resData)
                        setPagination({...pagination,
                              startIndex:resData.data.from,
                              endIndex:resData.data.to,
                              total:resData.data.total
                        })
                  }else{
                        toast.error(resData.message);
                  }
            }else{
                  toast.error(ErrorMessage.ANY)
            }

      }catch(err){
            console.log(err)
      }finally{
            setLoadding(false);
      }
  }

  const handleDeleteItem =async (id,e)=>{
        let item = e.target.parentNode.parentNode;
        try{
        const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
        if(!confirmed) return;
        const response = await fetch(`${BASE_URL}/imports/${id}`,{
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

    loadding  ? <Loader/> : <div className='p-6  space-y-6'>
            <Breadcrumb items={[{label:'الواردات',href:'/imports'}]}/>
            {/* Header + Add Button */}
            <div className="flex gap-4 justify-center md:justify-start items-center flex-wrap md:flex-nowrap">

                  <InfoCard title={'الواردات الكلية'} desc={'وراد'} number={dataInfo?.statistics?.imports} icon={'solar_user-bold.svg'} color={'red-900'}/>
                  <InfoCard title={'الواردات الشهر الحالي'} desc={'وارد'} number={dataInfo?.statistics?.month_imports} icon={'month.svg'}  color={'red-900'}/>
                  <InfoCard title={'الواردات السنة الحالية '} desc={'وارد'} number={dataInfo?.statistics.year_imports} icon={'year.svg'} color={'red-900'} />
                  <AddCard to={'/imports/new'} title={'اضافة وارد جديد'}/>
            
            </div>
            <div className='bg-white p-4 shadow-md rounded-md mt-8 border-t border-gray-50 space-y-6'>
                  {/* Search Inputs */}
                  <div className="grid grid-cols-4 gap-4">
                        <h2 className="text-xl font-semibold">الواردات الدموية</h2>
                        <select className='border border-gray-100 bg-gray-50 rounded' onChange={(e)=>setSearchBy(e.target.value)}>
                              <option value="">البحث بواسطة</option>
                              <option value="import_date" selected ={searchBy == 'import_date'}>تاريخ التوريد</option>
                              <option value="source" selected={ searchBy == 'source'}>المصدر</option>
                        </select>
                        <div className='col-span-2 flex items-center gap-1'>
                              <input
                                    type={searchBy == 'import_date'? 'date' : 'text'}
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
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('source')}>
                                          المصدر {getSortIcon('source')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('importDate')}>
                                          تاريخ التوريد {getSortIcon('importDate')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " >
                                    
                                    </th>
                                    </tr>
                              </thead>
                              <tbody className="text-sm divide-y divide-gray-200">
                                    {sortedData?.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                          <td className="p-4 border-b border-slate-200">{item.id}</td>
                                          <td className="p-4 border-b border-slate-200">{item.source}</td>
                                          <td className="p-4 border-b border-slate-200">{item.importDate }</td>
                                          <td className="p-4 border-b border-slate-200">
                                                <i class="fa-solid fa-pen-to-square" onClick={()=>navigate(`/imports/${item.id}/edit`)} title="Edit"></i>
                                                <i class="fa-solid fa-eye"  onClick={()=>navigate(`/imports/${item.id}`)} title="Show"></i>
                                                <i class="fa-solid fa-trash" onClick={(e)=>handleDeleteItem(item.id,e)} title="Delete"></i>
                                          </td>


                                    </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
                  {
                        dataInfo ? 
                        <Pagination dataInfo={dataInfo} fetchData={setCurrentPage}/> :''
                  }
            </div>
    </div>
  )
}

export default Imports
