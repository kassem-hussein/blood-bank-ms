import React from 'react'
import { useSelector } from 'react-redux'

const Header = ({setOpen}) => {
 const {user} =  useSelector(state=>state.user);
  return (
    <div className='w-full px-4 flex-1 flex h-16 items-center justify-between'>
            <div className='flex items-center gap-2'>
                  <div className='md:hidden' onClick={()=>setOpen(s=>!s)}>
                        <i class="fa-solid fa-bars"></i>
                  </div>
                  <h2 className='text-lg mb-0'>اهلا وسهلا,<span className='text-red-500 mr-2'>{user.name}</span></h2>
            </div>
            <div>
                  <div>
                      <div className='relative bg-white rounded-full text-lg flex items-center justify-center font-semibold w-8 h-8 group'>
                        {user.name[0]}
                        <div className='p-3 shadow-lg hidden bg-white rounded w-56 group-hover:block absolute top-5 left-0 border border-gray-200'>
                              <a >
                                    <div className='text-sm p-3 rounded hover:bg-gray-100  transition-all '>
                                          <i class="fa-solid fa-user"></i> <span>{user.name} ({user.role})</span>
                                    </div>
                              </a>
                              <a href="\change-password">
                                    <div className='text-sm p-3 rounded hover:bg-gray-100  transition-all '>
                                          <i class="fa-solid fa-key"></i> <span>تغير كلمة المرور</span>
                                    </div>
                              </a> 
                        </div>  
                      </div>
                  </div>
            </div>
    </div>
  )
}

export default Header
