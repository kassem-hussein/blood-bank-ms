import React from 'react'
import { Outlet } from 'react-router-dom'
const UnauthenticatedLayout = () => {
  return (
    <>
      <Outlet/>
    </>
  )
}

export default UnauthenticatedLayout
