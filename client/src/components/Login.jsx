import React, {useContext, useState} from 'react'
import { UserContext } from '../context/UserContext'
import axios from '../utils/axios'
import { useNavigate, Link } from 'react-router'

export default function Login() {
  // Get the login form state from UserContext
  const { loginForm, setLoginForm, initLogin } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Generic handler updates the login form fields by name
  const updateField = (e) => {
    const { name, value } = e.target
    setLoginForm(prev => ({ ...prev, [name]: value }))
  }

  // Basic client-side validation before sending to the server
  const validate = () => {
    setError('')
    if (!loginForm.email || !loginForm.password) {
      setError('Email and password are required.')
      return false
    }
    return true
  }

  // Submit handler: send credentials to backend and process result
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      // POST /auth - backend sets an httpOnly refresh cookie and returns an access token
      const res = await axios.post('/auth', loginForm)
      // The server responds with an access token in plain text (or JSON string)
      const token = res?.data
      if (token) {
        // Save access token locally for use in client-side requests. Keep in mind
        // the refresh token is stored in a secure cookie (httpOnly), which is managed automatically.
        localStorage.setItem('accessToken', token)
        setSuccess('Logged in successfully')
        // Reset the login form in context and navigate to the home route
        setLoginForm(initLogin)
        navigate('/')
      } else {
        setError('Login failed. No token received from server.')
      }
    } catch (err) {
      // Show readable server message when available
      setError(err?.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={loginForm.email} onChange={updateField} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" value={loginForm.password} onChange={updateField} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-red-600">{error}</div>
          <div className="text-sm text-green-600">{success}</div>
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
        {/* Quick link for new users to go to the register page. Using Link ensures
          the app's router handles the navigation without a full page refresh. */}
      <p className="text-sm mt-3">
        Don't have an account?{' '}
        {/* Link provides semantic navigation for accessibility and SEO; it performs client-side routing similar to navigate without a full refresh */}
        <Link to="/register" className="text-blue-600 hover:underline">Create one</Link>
      </p>
    </section>
  )
}
