import { Outlet, Navigate } from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { getAccessToken } from '../utils/localStorage'
import Nav from '../components/Nav'
export default function PrivateLayout() {
  const { auth } = useContext(UserContext)
  const token = getAccessToken()
  if (!auth && !token) {
    return <Navigate to="/" />
  }

  return(
    <div className={`absolute h-full w-full grid grid-cols-8`}>
    <Nav />
    <Outlet />
    </div>
  )
}