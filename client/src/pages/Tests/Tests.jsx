/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AddCard, Breadcrumb, InfoCard, Loader } from '../../components';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../Utils/RequestMessage';
import Pagination from './../../components/Pagination';
import { BASE_URL } from '../../Constrants/Constrant';

const Tests = () => {
 const [data,setData] = useState();
 const [dataInfo ,setDataInfo] = useState();
 const navigate       = useNavigate();
 const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
 const [currentPage, setCurrentPage] = useState(1);
 const [loadding,setLoadding] = useState(false);
 const {token}        = useSelector(state=>state.user); 
 const fetchData      = async()=>{
      setLoadding(true);
      try{
            const response = await fetch(`${BASE_URL}/tests?page=${currentPage}`,{
                  headers:{
                        'Accept':'application/json',
                        'Authorization':'Bearer '+token
                  }
            })
            const resData = await response.json();
            if(response.status == 500){
                  toast.error(ErrorMessage.SERVER_ERROR)
                  navigate('/500')
            }else if(response.status == 401 || response.status == 403){
                  toast.error(ErrorMessage.AUNTHORIZED)
            }else if(response.ok){
                  setData(resData.data);
                  setDataInfo(resData)
            }else{
                  toast.error(ErrorMessage.ANY);
            }
      }catch{
            navigate('/500')
      }finally{
            setLoadding(false);
      }
 }
 useEffect(()=>{
      fetchData();
 },[currentPage])


 const sortedData = [...data?.data || []].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const totalRows = data?.total;
  const startIndex = data?.from;
  const endIndex = data?.to;


  const handleDeleteItem =async (id,e)=>{
      let item = e.target.parentNode.parentNode;
      try{
      const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
      if(!confirmed) return;
      const response = await fetch(`${BASE_URL}/tests/${id}`,{
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
  return (
      loadding? <Loader/>:data?
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
            <Breadcrumb items={[{label:'التحاليل الدموية (المختبر)',href:'#'}]}/>
            



            <div className="flex gap-4 justify-center md:justify-start items-center flex-wrap md:flex-nowrap">

                  <InfoCard title={'  التحاليل الكلية'} desc={'تحليل'} number={dataInfo?.statistics?.tests} icon={'solar_user-bold.svg'} color={'red-900'} />
                  <InfoCard title={'التحاليل السليمة'} desc={'تحليل'} number={dataInfo?.statistics?.normal_tests} icon={'check.svg'}  color={'green-600'}/>
                  <InfoCard title={' التحاليل الغير سليمة'} desc={'تحليل'} number={dataInfo?.statistics?.denormal_tests} icon={'notallowed.svg'} color={'red-600'} />
                  <AddCard to={'/tests/new'} title={'اضافة تحليل جديد'}/>
                  
            </div>

            <div className='bg-white p-4 shadow-md rounded border-t border-gray-50 space-y-6'>
                  {/* Table */}
                  <h2 className="text-xl font-semibold">جميع التحاليل</h2>
                  <div className="flex flex-col w-full h-full overflow-x-auto text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                        <table className="w-full text-left table-auto min-w-max">
                              <thead className="">
                                    <tr>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('id')}>
                                    # {getSortIcon('id')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('unit_id')}>
                                    معرف الزمرة الدموية{getSortIcon('unit_id')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('HIV')}>
                                    اختبار نقص المناعة {getSortIcon('HIV')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('hepatitis_B')}>
                                    ألتهاب الكبد(B)  {getSortIcon('hepatitis_B')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('hepatitis_C')}>
                                    التهاب الكبد (C) {getSortIcon('hepatitis_C')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('syphilis')}>
                                    الزهري {getSortIcon('syphilis')}
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('malaria')}>
                                    الملاريا{getSortIcon('malaria')}
                                    </th>
                                    
                                    <th className="p-4 border-b border-slate-300 " >
                                          حالة الاختبار (الكلي)
                                    </th>
                                    <th className="p-4 border-b border-slate-300 " >
                                    
                                    </th>
                                    </tr>
                              </thead>
                              <tbody className="text-sm divide-y divide-gray-200">
                                    {sortedData?.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 border-b border-slate-200">{item.id}</td>
                                    <td className="p-4 border-b border-slate-200">{item.unit_id}</td>
                                    <td className="p-4 border-b border-slate-200">{item.HIV ? "ايجابي":'سلبي'}</td>
                                    <td className="p-4 border-b border-slate-200">{item.hepatitis_B ? "ايجابي":"سلبي"}</td>
                                    <td className="p-4 border-b border-slate-200">{item.hepatitis_C ? "ايجابي":"سلبي"}</td>
                                    <td className="p-4 border-b border-slate-200">{item.syphilis ?"ايجابي": "سلبي"}</td>
                                    <td className="p-4 border-b border-slate-200">{item.malaria ? " ايجابي":"سلبي"}</td>
                                    <td className={`p-4 border-b border-slate-200 `}>
                                          <div className={`flex items-center justify-center  ${( item.HIV || item.hepatitis_B || item.hepatitis_C || item.syphilis || item.malaria ) ? 'bg-red-100 text-red-500 ':'bg-green-100 text-green-500'}  px-2 py-1  rounded-full text-xs font-semibold`}>
                                                {( item.HIV || item.hepatitis_B || item.hepatitis_C || item.syphilis || item.malaria ) ? 'فشل الاختبار':'نجح الاختبار' }
                                          </div>
                                          
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                          <i class="fa-solid fa-pen-to-square" onClick={()=>navigate(`/tests/${item.id}/edit`)} title="Edit"></i>
                                          <i class="fa-solid fa-eye" onClick={()=>navigate(`/tests/${item.id}`)} title="Show"></i>
                                          <i class="fa-solid fa-trash text-red-500" onClick={(e)=>handleDeleteItem(item.id,e)} title="Delete"></i>
                                    </td>
                                    </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
                  <Pagination dataInfo={dataInfo} fetchData={setCurrentPage}/>   
            </div>
            


    </div> :''
  )
}

export default Tests
