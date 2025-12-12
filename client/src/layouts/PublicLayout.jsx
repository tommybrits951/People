import { Outlet, Navigate } from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { getAccessToken } from '../utils/localStorage'

export default function PublicLayout() {
  const { auth } = useContext(UserContext)
  const token = getAccessToken()
  if (auth && token) {
    return <Navigate to="/home" />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Outlet />
    </div>
  )
}
