import { Outlet, Navigate } from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
export default function PublicLayout() {
  const { auth } = useContext(UserContext)
  if (auth) {
    return <Navigate to="/home" />
  }
  return <Outlet />
}
