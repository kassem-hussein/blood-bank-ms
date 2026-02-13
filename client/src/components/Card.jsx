import React from 'react'

const Card = ({title,icon,count,is_icon}) => {
  return (
    <div className="bg-red-50 shadow rounded-lg p-6 flex items-center">
      
      {/* Icon */}
      {
        is_icon?
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
          {icon}
        </div>:''
      }

      {/* Title + Count */}
      <div className="mr-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>

  )
}

export default Card
