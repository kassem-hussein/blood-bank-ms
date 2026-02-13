import React from 'react'
import { Link } from 'react-router-dom'

const InfoCard = ({title,to}) => {
  return (
    <Link to={to}>
      <div className='w-[250px] h-[150px] rounded flex flex-col items-center justify-center bg-green-50  border border-green-500 shadow-md p-4'>
          <img className='w-8 h-8' src='add.svg' alt="blood"/>
          <h3 className='font-medium text-[1.2rem] text-green-600'>{title}</h3>
        </div>
    </Link>
  )
}

export default InfoCard
