import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./components/AuthContext"

export default function CustomRoute() {
  const {currentUser}=useAuth()
  
  if(!currentUser){
  console.log("Not signed in")
  return <Navigate to="/signIn"/>
  }
    return <Outlet/>
  }
