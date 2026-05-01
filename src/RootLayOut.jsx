import React from 'react'
import { Outlet } from 'react-router-dom'
// import NavbarRight from './layer/NavvarRight'

const RootLayOut = () => {
  return (
    <div className=" h-screen w-full">
        <Outlet/>
    </div>
  )
}

export default RootLayOut