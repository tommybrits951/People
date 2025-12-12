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
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex flex-col">
      <Nav />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <FriendsList />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}