import React from 'react'

const History = ({routes}) => {
  
  return (
      <nav class="px-4 py-2 flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
            {routes.map(function (route,index){
                  
                  if(index == routes.length -1) return ;
                  return ( 
                        <div className='inline-flex'>
                              <li class="inline-flex items-center">
                              <a href={`${route.herf}`} class="inline-flex text-lg items-center text-gray-400 hover:text-red-600">
   
                                    {route.name}
                              </a>
                              </li>
                              <li>
                              <div class="text-lg flex items-center mx-2">
                                    /
                              </div>
                              </li>
                              
                        </div>
                  )

            })}

              <li aria-current="page">
                <span class="text-gray-900 text-lg font-medium">{routes[routes.length -1].name}</span>
              </li>
            </ol>
      </nav>
  )
}

export default History
