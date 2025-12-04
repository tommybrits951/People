import { Outlet, Navigate } from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { getAccessToken } from '../utils/localStorage'
export default function PublicLayout() {
  const { auth } = useContext(UserContext)
  const token = getAccessToken()
  console.log(auth)
  if (auth && token) {
    return <Navigate to="/home" />
  }
  return <Outlet />
}
