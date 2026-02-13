/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Breadcrumb, CycleChart, DisplayCard, GroupChart, History, Loader, MonthlyBarChart, TopTenDonors } from '../../components'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { href, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../Constrants/Constrant';
const Home = () => {
  const {user,token} =  useSelector(state=>state.user);
  const [available,setAvailable] = useState([]);
  const [data,setData] = useState();
  const navigate       = useNavigate();
  const [lodding,setLodding] = useState(false);
  const [used,setUsed] = useState([]);
  const [testing,setTesting] = useState([]);
  const [inValid,setInvalid] = useState([]);
  const [expired,setExpired] = useState([]);

    
    useEffect(()=>{
        async function fetchData() {
              setLodding(true);
              try{
                    const response  = await fetch(`${BASE_URL}/statistics`,{
                          headers:{
                                'Accept':'application/json',
                                'Authorization':'Bearer '+token
                          }
                    })
                    if(!response.ok){
                          console.log(response)
                          toast.error(response.statusText);
                    }else{
                          const resData = await response.json();
                          console.log(resData)
                          let tempAvaliable = [];
                          let tempused =[];
                          let tempTesting = [];
                          let tempExpired = [];
                          let tempInvalid =[];
                         for (const key in resData.blood_statistics) {
                          let item = resData.blood_statistics[key];
                          tempAvaliable.push(item.available.units);
                          tempTesting.push(item.testing.units);
                          tempExpired.push(item.expired.units);
                          tempInvalid.push(item.invalid.units);
                          tempused.push(item.used.units);
                          
                          }
                          setTesting(tempTesting);
                          setExpired(tempExpired);
                          setUsed(tempused);
                          setAvailable(tempAvaliable);
                          setInvalid(tempInvalid);
                          setData(resData);
                          
                          
                            

        
                    }
        
              }catch(err){
                    navigate('/500');
                    console.log(err);
              }finally{
                setLodding(false);
              }
        }
  
        fetchData();
  
    },[])
  return (
    <div>
      {
        lodding?<Loader/>:data?.success?
        <div className='mx-auto space-y-6'>
          <Breadcrumb items={[{label:'الاحصائيات الاساسية للموقع',href:'/'}]}/>
          {
            user.role == 'doctor'?
            <div className='shadow-md p-4 border-t border-gray-50  rounded-lg'>
                <h1 className='text-lg font-semibold my-2'><i className='fa fas fa-vial'></i> <span>الوحدات الدموية التي تحتاج الى أختبار</span></h1>
                <div className='mt-3 flex flex-wrap gap-2 justify-center '>
                  <DisplayCard is_icon={false} title={'A+'}   count={data?.blood_statistics['A+'].testing.units} />
                  <DisplayCard is_icon={false} title={'A-'}   count={data?.blood_statistics['A-'].testing.units} />
                  <DisplayCard is_icon={false} title={'B+'}   count={data?.blood_statistics['B+'].testing.units} />
                  <DisplayCard is_icon={false} title={'B-'}   count={data?.blood_statistics['B-'].testing.units} />
                  <DisplayCard is_icon={false} title={'AB+'}  count={data?.blood_statistics['AB+'].testing.units} />
                  <DisplayCard is_icon={false} title={'AB-'}  count={data?.blood_statistics['AB-'].testing.units} />
                  <DisplayCard is_icon={false} title={'O+'}   count={data?.blood_statistics['O+'].testing.units} />
                  <DisplayCard is_icon={false} title={'O-'}   count={data?.blood_statistics['O-'].testing.units} />
                  
                </div>
            </div>:
            <div>

              <MonthlyBarChart  monthly={{"donations":Object.values(data?.monthly_donations_statistics),
                            "imports":Object.values(data?.monthly_import_statistics),
                            "exports":Object.values(data?.monthly_export_statistics)
                        }}/>
              <div className='bg-white shadow rounded-lg p-4 mt-4 flex flex-wrap justify-center gap-2'>
                

                <div className='flex-1 w-[300px] h-[50vh]'>
                    <CycleChart 
                        AU={data?.blood_statistics['A+'].available.units}     
                        AD={data?.blood_statistics['A-'].available.units}     
                        BU={data?.blood_statistics['B+'].available.units}     
                        BD={data?.blood_statistics['B-'].available.units}     
                        ABU={data?.blood_statistics['AB+'].available.units}     
                        ABD={data?.blood_statistics['AB-'].available.units}     
                        OU={data?.blood_statistics['O+'].available.units}     
                        OD={data?.blood_statistics['O-'].available.units}     
                      />
                </div>
                <div className='flex-2 min-w-[300px] mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                      <DisplayCard title={'الوحدات المتاحة'}       icon={<i className="fas fa-check-circle" style={{color:'green'}}></i>} count={available.reduce((acc, curr) => acc + curr, 0)} />
                      <DisplayCard title={'الوحدات قيد الاختبار'}   icon={<i className="fas fa-flask" style={{color:'orange'}}></i>}  count={testing.reduce((acc, curr) => acc + curr, 0)} />
                      <DisplayCard title={'الوحدات المستخدمة'}    icon={<i className="fas fa-history" style={{color:'blue'}}></i>}  count={used.reduce((acc, curr) => acc + curr, 0)} />
                      <DisplayCard title={'الوحدات المنتهية'}     icon={<i className="fas fa-hourglass-end" style={{color:'gray'}}></i>} count={expired.reduce((acc, curr) => acc + curr, 0)} />
                      <DisplayCard title={'الوحدات الغير صالحة'}  icon={<i className="fas fa-times-circle" style={{color:'red'}}></i>} count={inValid.reduce((acc, curr) => acc + curr, 0)} />
                      <DisplayCard title={'مجمل الوحدات الدموية'}  icon={<i className="fas fa-chart-pie" style={{color:'gray'}}></i>} count={ available.reduce((acc, curr) => acc + curr, 0)+ testing.reduce((acc, curr) => acc + curr, 0)+ used.reduce((acc, curr) => acc + curr, 0) + expired.reduce((acc, curr) => acc + curr, 0) +  inValid.reduce((acc, curr) => acc + curr, 0)} /> 
                </div>
              </div>
              <div className='bg-white shadow rounded-lg p-4 mt-4 min-h-[350px]'>
                <GroupChart
                  available={available}
                  testing={testing}
                  used={used}
                  expired={expired}
                  inValid={inValid}
                />
              </div>
            
              <div className='bg-white shadow rounded-lg p-4 mt-4'>
                
                <h2 class="flex items-center gap-2 text-gray-800 font-bold text-md my-8 underline px-4 py-2">
                  <i class="fas fa-hand-holding-heart"></i>
                  <span>الاشخاص الاكثر تبرعاً</span>
                </h2>

                 <TopTenDonors topTen={data?.top_10_donors}/>
              </div>
            </div>
          }
        </div>:<div className='bg-yallow-500 text-black rounded'>
          لا يوجد بيانات لعرضها 
        </div>
      }
         
    </div>
  )
}

export default Home
