import { useContext, useEffect } from 'react'
import {Routes, Route} from 'react-router'
import './App.css'
import { UserContext } from './context/UserContext'
import { getAccessToken, setAccessToken } from './utils/localStorage'
import axios from './utils/axios'
import Register from './components/Register'  
import PublicLayout from './layouts/PublicLayout'
import PrivateLayout from './layouts/PrivateLayout'
import Login from './components/Login'
import Home from './components/Home'

function App() {
  const { auth, setAuth, user, setUser } = useContext(UserContext)
  const token = getAccessToken()
  if (token) {
    setAuth(token)
  }
  if (!token) {
    axios.get("/auth").then(res => {
      setAuth(res.data) 
      setAccessToken(res.data)
    }).catch(err => console.log(err))
  }


  return (
    <main>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route element={<Register />} path='/register'/>
          <Route element={<Login />} path='/'/>
        </Route>
        <Route element={<PrivateLayout />}>
          <Route element={<Home />} path='/home'/>
        </Route>
      </Routes>
    </main>
  )
}

export default App
