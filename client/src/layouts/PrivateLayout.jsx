import { Outlet, Navigate } from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { getAccessToken } from '../utils/localStorage'
import Nav from '../components/Nav'
import FriendsList from '../components/FriendsList'
export default function PrivateLayout() {
  const { auth } = useContext(UserContext)
  const token = getAccessToken()
  if (!auth && !token) {
    return <Navigate to="/" />
  }

  return(
    <div className={`absolute h-full w-full p-0 overflow-hidden m-0 flex`}>
    <Nav />
    <FriendsList />
    <Outlet />
    </div>
  )
}