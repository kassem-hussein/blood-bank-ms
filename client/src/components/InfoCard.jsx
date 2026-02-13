import React from 'react'

const InfoCard = ({title,icon,number,desc,color}) => {
  return (
    <>
      <div className='w-[250px] h-[150px] rounded bg-white border shadow-md p-4'>
          <img className='w-8 h-8' src={icon} alt="blood"/>
          <p className='font-medium text-[1.09rem]'>{title}</p>
          <h2 className='font-bold text-[1.75rem]'>{number} <span className={`text-sm font-normal text-${color}`}>({desc})</span></h2>
        </div>
    </>
  )
}

export default InfoCard
