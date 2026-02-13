/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AddCard, Breadcrumb, Loader, Pagination } from '../../components';
import { current } from '@reduxjs/toolkit';
import ErrorMessage from '../../Utils/RequestMessage';
import InfoCard from './../../components/InfoCard';
import { BASE_URL } from '../../Constrants/Constrant';



const Table = () => {
  const navigate = useNavigate();
  const [searchBy ,setSearchBy] = useState('id');
  const {token} = useSelector(state=>state.user);
  const [data, setData] = useState();
  const [dataInfo,setDataInfo] = useState();
  const [lodding,setLodding] = useState(false);
  const [refetch, setrefecth] = useState(false);
  const [search, setSearch] = useState("");
  // const [sortData , setSortData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);



  async function getData(){
      try{
        setLodding(true)

        const url = `${BASE_URL}/blood-units?&${searchBy}=${encodeURIComponent(search)}&page=${currentPage}`;
        const response = await fetch(url,{
          headers:{
            'Accept':'application/json',
            'Authorization':'Bearer '+token
          }
        })
        if(!response.ok){
            if(response.status == 401 || response.status == 403){
                toast.error(ErrorMessage.AUNTHORIZED);
            }
        }else{
          const resData =await response.json()
          if(resData.success){
            console.log(resData)
            setData(resData.data)
            setDataInfo(resData);
          }
        }
        
      }catch(err){
          console.log(err)
      }finally{
        setLodding(false)
      }
    }
  useEffect(()=>{
    getData();
  },[currentPage,refetch])

  const handleSearch = ()=>{
    setrefecth(i=>!i)
  }





  const handleSearchChange = (value) => {
    setSearch(value)
  };

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

  
  // const filteredData = data?.data?.filter((item) =>{
  //     if(searchBy == 'donor'){
  //           return  !search || item.donor.name.includes(search) 
  //     }
  //     return  !search || item[searchBy] == search 

  // }
  // );
  

  const sortedData = [...data?.data || []].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });



  const totalRows = data?.total;
  const startIndex = data?.from;
  const endIndex = data?.to;
  
  const handleOptionChange = (e)=>{
      setSearchBy(e.target.value);
      
  }
  const clearFilter =()=>{
      setSearchBy('');
      setSearch('');
      setrefecth(i=>!i);
  }
  const handleDeleteBloodUnit = async (id,e)=>{
    let item = e.target.parentNode.parentNode;
    try{
      const confirmed = confirm('هل تريد حذف هذا العنصر ؟ لن تتمكن من ارجاعه مرة اخرى ');
      if(!confirmed) return;
      const response = await fetch(`${BASE_URL}/blood-units/${id}`,{
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
    lodding? <Loader/>:data?
    <div className="p-4  space-y-6 ">
      {/* Navigation History */}
      <Breadcrumb items={[{label:'الوحدات الدموية',herf:'/blood-units'}]}/>

      {/* Header + Add Button */}
      <h2 className="text-xl font-semibold">الوحدات الدموية</h2>
      <div className="flex gap-4 justify-center md:justify-start items-center flex-wrap md:flex-nowrap">

        <InfoCard title={' عدد الوحدات الدموية'} desc={'وحدة دموية'} number={dataInfo?.statstics?.units} icon={'blood.svg'} color={'red-900'}/>
        <InfoCard title={'الوحدات الدموية المتاحة'} desc={'وحدة دموية'} number={dataInfo?.statstics?.available_units} icon={'check.svg'} color={'green-600'}/>
        <InfoCard title={'الوحدات الدموية الغير متاحة'} desc={'وحدة دموية'} number={dataInfo?.statstics?.expired_units} icon={'notallowed.svg'} color={'red-600'} />
        <AddCard to={'/blood-units/new'} title={'اضافة وحدة دموية'}/>
      
      </div>


    <div className='bg-white p-4 rounded-md  border-gray-50 border-t shadow-md space-y-6'>
      {/* Search Inputs */}
      <div className="grid grid-cols-4 gap-4 items-center">
        <h3 className='font-medium text-[1.2rem]'>جميع الوحدات الدموية</h3>
        <select className='border border-gray-100 bg-gray-50 rounded py-1' onChange={handleOptionChange}>
            <option value="">البحث بواسطة</option>
            <option value="id" selected = {searchBy == 'id'}>المعرف</option>
            <option value="donation_date" selected = {searchBy == 'donation_date'}>تاريخ  التبرع</option>
            <option value="blood" selected ={searchBy == 'blood'}>الفئة الدموية</option>
            <option value="volume" selected={ searchBy == 'volume'}>الكمية</option>
        </select>
        <div className='col-span-2 flex items-center gap-1'>
          <input
            type={searchBy == 'donation_date' ?'date': searchBy == 'volume'? 'number' : 'text'}
            placeholder="ابحث هنا..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="px-3 w-full  py-2 bg-white border-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={()=>handleSearch()} type="button" className='bg-gray-50 border px-2 py-2 text-black rounded '><i className='fa fa-search'></i></button>
          <button onClick={()=>clearFilter()} type="button" className='bg-gray-50 border px-2 py-2 text-black rounded '><i className='fas fa-times'></i></button>
          
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col w-full h-full overflow-x-auto text-gray-700  rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead className="bg-white">
            <tr>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('id')}>
                # {getSortIcon('id')}
              </th>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('type')}>
                نوع الكيس {getSortIcon('type')}
              </th>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('volume')}>
                الكمية {getSortIcon('volume')}
              </th>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('BloodType')}>
                الوحدة الدموية {getSortIcon('BloodType')}
              </th>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('status')}>
                الحالة {getSortIcon('status')}
              </th>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('donor')}>
                المتبرع{getSortIcon('donor')}
              </th>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('donationDate')}>
                تاريخ التبرع {getSortIcon('donationDate')}
              </th>
              <th className="p-4 border-b border-slate-300 " onClick={() => requestSort('expiredDate')}>
                تاريخ الانتهاء {getSortIcon('expiredDate')}
              </th>
              <th className="p-4 border-b border-slate-300 " >
                الادارة
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-200">
            {sortedData?.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="p-4 border-b border-slate-200">{item.id}</td>
                <td className="p-4 border-b border-slate-200">{item.type}</td>
                <td className="p-4 border-b border-slate-200">{item.volume}</td>
                <td className="p-4 border-b border-slate-200">{item.bloodType}</td>
                <td className="p-4 border-b border-slate-200 ">
                  <span 
                    className={`${
                            item.status == 'available' ? 'bg-green-50 text-green-500'
                    :       item.status == 'testing' ? 'bg-yellow-50 text-yellow-500'
                    :       item.status == 'invalid' ? 'bg-red-50 text-red-500'
                    :       item.status ==  'expired' ? 'bg-indigo-50 text-indigo-500' 
                    :       'bg-blue-50 text-blue-500 '} rounded-full px-4 py-1`}>
                    {item.status}

                  </span>
                  
                </td>
                <td className="p-4 border-b border-slate-200">{item?.donor?.name || 'N/A'}</td>
                <td className="p-4 border-b border-slate-200">{item.donationDate}</td>
                <td className="p-4 border-b border-slate-200">{item.expiredDate}</td>
                <td className="p-4 border-b border-slate-200">
                      <i class="fa-solid fa-pen-to-square" onClick={()=>navigate(`/blood-units/${item.id}/edit`)} title="Edit"></i>
                      <i class="fa-solid fa-eye" onClick={()=>navigate(`/blood-units/${item.id}`)} title="Show"></i>
                      <i class="fa-solid fa-trash text-red-500" onClick={(e)=>handleDeleteBloodUnit(item.id,e)} title="Delete"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <Pagination dataInfo={dataInfo} fetchData={setCurrentPage}/>
      {/* Pagination
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {startIndex }– {endIndex} of {totalRows}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!data?.prev_page_url}
            className="px-4 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!data?.next_page_url}
            className="px-4 py-1  border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div> */}
      
    </div>
    </div> :''
  );
};

export default Table;