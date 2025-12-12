import React, {useContext, useState} from 'react'
import { UserContext } from '../context/UserContext'
import axios from '../utils/axios'
import { useNavigate, Link } from 'react-router'

export default function Login() {
  const { loginForm, setLoginForm, initLogin } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const updateField = (e) => {
    const { name, value } = e.target
    setLoginForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    setError('')
    if (!loginForm.email || !loginForm.password) {
      setError('Email and password are required.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/auth', loginForm)
      const token = res?.data
      if (token) {
        localStorage.setItem('accessToken', token)
        setSuccess('Logged in successfully')
        setLoginForm(initLogin)
        navigate('/home')
      } else {
        setError('Login failed. No token received from server.')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Welcome Back</h2>
        <p className="text-gray-300 mb-8">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
            <input 
              name="email" 
              type="email" 
              value={loginForm.email} 
              onChange={updateField} 
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              value={loginForm.password} 
              onChange={updateField} 
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
          {success && <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">{success}</div>}

          <button 
            disabled={loading} 
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer">Create one</Link>
        </p>
      </section>
    </div>
  )
}
