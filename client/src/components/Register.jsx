import {useContext, useState, useCallback} from 'react'
import { UserContext } from '../context/UserContext'
import axios from '../utils/axios'
import Cropper from 'react-easy-crop'
import { useNavigate } from 'react-router'

export default function Register() {
  
  
  const {registerForm, setRegisterForm, initRegister} = useContext(UserContext)
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [file, setFile] = useState(null)
  
  const [imgSrc, setImgSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()
  
  
  const updateField = (e) => {
    const { name, value } = e.target
    setRegisterForm(prev => ({ ...prev, [name]: value }))
  }

  
  
  const onSelectFile = (e) => {
    const selectedFile = e.target.files && e.target.files[0]
    if (!selectedFile) return
    setFile(selectedFile)
    setImgSrc(URL.createObjectURL(selectedFile))
  }

  
  
  const onCropComplete = useCallback((croppedArea, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx)
  }, [])

  
  
  const validateForm = () => {
    setError('')
    if (!registerForm.first_name || !registerForm.last_name || !registerForm.email || !registerForm.password) {
      setError('Please fill out required fields')
      return false
    }
    
    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (registerForm.password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!file) {
      setError('Please upload a profile image.')
      return false
    }
    
    
    if (!croppedAreaPixels) {
      setError('Please crop and confirm the image.')
      return false
    }
    return true
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const formData = new FormData()
      Object.keys(registerForm).forEach(k => formData.append(k, registerForm[k] || ''))
      if (croppedAreaPixels) {
        const { x, y, width, height } = croppedAreaPixels
        formData.append('x', Math.round(x))
        formData.append('y', Math.round(y))
        formData.append('width', Math.round(width))
        formData.append('height', Math.round(height))
      }
      if (file) formData.append('img', file)

      const res = await axios.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (res?.status === 201) {
        setSuccess(res.data?.message || 'User registered successfully.')
        setRegisterForm(initRegister)
        setConfirmPassword('')
        setFile(null)
        setImgSrc(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
      } else {
        setError(res?.data?.message || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
      navigate("/")
    }
  }

  
  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input name="first_name" value={registerForm.first_name} onChange={updateField} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input name="last_name" value={registerForm.last_name} onChange={updateField} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">DOB</label>
            <input type="date" name="dob" value={registerForm.dob} onChange={updateField} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal</label>
            <input name="postal" value={registerForm.postal} onChange={updateField} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select name="gender" value={registerForm.gender} onChange={updateField} className="w-full px-3 py-2 border rounded">
              <option>Private</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" value={registerForm.email} onChange={updateField} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" value={registerForm.password} onChange={updateField} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profile image (optional)</label>
          <input type="file" accept="image/*" onChange={onSelectFile} className="w-full" />
        </div>

        {/* If an image was selected, render the cropper so the user can select an exact square crop */}
        {imgSrc && (
          <div className="mt-2">
            <div className="relative w-full h-64 bg-gray-100">
              <Cropper
                image={imgSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="text-sm">Zoom</label>
              <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
            </div>
            <div className="mt-2 flex gap-2">
              {/* Reset image clears the selected file + crop preview so the user can pick a different file */}
              <button type="button" onClick={() => { setFile(null); setImgSrc(null); setCroppedAreaPixels(null); setZoom(1); }} className="text-sm text-gray-600 underline">Reset image</button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-red-600">{error}</div>
          <div className="text-sm text-green-600">{success}</div>
          <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">{loading ? 'Registering...' : 'Register'}</button>
        </div>
      </form>
    </section>
  )
}
