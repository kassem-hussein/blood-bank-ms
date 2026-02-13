import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header,SlideBar } from '../components'
import Aside from './../components/Aside';

const AuthenticatedLayout = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="flex items-start h-screen overflow-x-auto "  style={{ backgroundColor: '#FBFBFB' }}>
    <Aside  open={openMenu}/>
  <div className="flex-1 p-6 min-w-[70vw] h-screen">
    <div className="min-h-[80vh]">
      <i className='md:hidden fa fa-bars' onClick={()=>setOpenMenu(prev=>!prev)}></i>
      <Outlet />
    </div>
  </div>
</div>
  )
}

export default AuthenticatedLayout
