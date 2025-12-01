import { useState } from 'react'
import {Routes, Route} from 'react-router'
import './App.css'
import UserProvider from './context/UserContext'
import Register from './components/Register'  
function App() {

  return (
    <main>
      <UserProvider>

      <Routes>
        <Route element={<Register />} path='/'/>
      </Routes>
      </UserProvider>
    </main>
  )
}

export default App
