import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const userType = JSON.parse(sessionStorage.getItem('userType')) || JSON.parse(localStorage.getItem('userType'));

export function PrivertRouteToSignin({isLogged}) {
  return (
    isLogged === 'false' ? <Outlet/> : <Navigate to="/signin" />
  )
}

export function PrivertRouteToHome({isLogged}) {
  return (
    isLogged !== 'false' ? <Outlet/> : <Navigate to="/home" />
  )
}

export function PrivertRouteToForbidden() {
  return (
    userType === 'owner' ? <Outlet/> : <Navigate to="/forbidden" />
  )
}
