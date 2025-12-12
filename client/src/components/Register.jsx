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
    // Required fields
    if (!registerForm.first_name || !registerForm.last_name || !registerForm.email || !registerForm.password) {
      setError('Please fill out all required fields (First Name, Last Name, Email, Password)')
      return false
    }
    
    if (!registerForm.dob || !registerForm.postal) {
      setError('Please fill out Date of Birth and Postal Code')
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

  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setRegisterForm(prev => ({ ...prev, [name]: checked }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <section className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Create an Account</h2>
        <p className="text-gray-300 mb-8">Join our community today</p>
        <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BASIC INFO SECTION */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First name <span className="text-red-400">*</span></label>
              <input name="first_name" value={registerForm.first_name} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last name <span className="text-red-400">*</span></label>
              <input name="last_name" value={registerForm.last_name} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email <span className="text-red-400">*</span></label>
              <input type="email" name="email" value={registerForm.email} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input type="tel" name="phone" value={registerForm.phone} onChange={updateField} placeholder="(123) 456-7890" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* PROFILE DETAILS SECTION */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Profile Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" name="dob" value={registerForm.dob} onChange={updateField} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select name="gender" value={registerForm.gender} onChange={updateField} className="w-full px-3 py-2 border rounded">
                <option value="Private">Private</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Relationship Status</label>
              <select name="relationship_status" value={registerForm.relationship_status} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors">
                <option value="" className="bg-slate-800 text-white">Select...</option>
                <option value="Single" className="bg-slate-800 text-white">Single</option>
                <option value="In a relationship" className="bg-slate-800 text-white">In a relationship</option>
                <option value="Married" className="bg-slate-800 text-white">Married</option>
                <option value="Prefer not to say" className="bg-slate-800 text-white">Prefer not to say</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea name="bio" value={registerForm.bio} onChange={updateField} placeholder="Tell us about yourself..." rows="3" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
              <input type="text" name="timezone" value={registerForm.timezone} onChange={updateField} placeholder="e.g., EST, PST" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* LOCATION SECTION */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code <span className="text-red-400">*</span></label>
              <input name="postal" value={registerForm.postal} onChange={updateField} placeholder="12345" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
              <input name="city" value={registerForm.city} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
              <input name="state" value={registerForm.state} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <input name="country" value={registerForm.country} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Address</label>
            <input name="location" value={registerForm.location} onChange={updateField} placeholder="Street address, apartment, etc." className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
          </div>
        </div>

        {/* PROFESSIONAL SECTION */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Occupation</label>
              <input name="occupation" value={registerForm.occupation} onChange={updateField} placeholder="e.g., Software Engineer" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input name="company" value={registerForm.company} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Education</label>
              <input name="education" value={registerForm.education} onChange={updateField} placeholder="e.g., Bachelor's in Computer Science" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
              <input type="url" name="website" value={registerForm.website} onChange={updateField} placeholder="https://example.com" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="flex items-center mt-4">
              <input type="checkbox" name="looking_for_work" checked={registerForm.looking_for_work} onChange={handleCheckboxChange} className="w-4 h-4 rounded bg-white/5 border border-white/20 text-purple-600 focus:ring-purple-500 cursor-pointer" />
              <span className="text-sm text-gray-300 ml-2">I'm open to work opportunities</span>
            </label>
          </div>
        </div>

        {/* SOCIAL MEDIA SECTION */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">Social Media (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
              <input type="url" name="facebook_url" value={registerForm.facebook_url} onChange={updateField} placeholder="https://facebook.com/..." className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
              <input type="url" name="twitter_url" value={registerForm.twitter_url} onChange={updateField} placeholder="https://twitter.com/..." className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
              <input type="url" name="instagram_url" value={registerForm.instagram_url} onChange={updateField} placeholder="https://instagram.com/..." className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
              <input type="url" name="linkedin_url" value={registerForm.linkedin_url} onChange={updateField} placeholder="https://linkedin.com/..." className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
            <input type="url" name="github_url" value={registerForm.github_url} onChange={updateField} placeholder="https://github.com/..." className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
          </div>
        </div>

        {/* INTERESTS & SKILLS SECTION */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Interests & Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Interests (comma-separated)</label>
              <input type="text" name="interests" value={registerForm.interests} onChange={updateField} placeholder="e.g., Photography, Travel, Coding" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma-separated)</label>
              <input type="text" name="skills" value={registerForm.skills} onChange={updateField} placeholder="e.g., JavaScript, React, Node.js" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* PASSWORD SECTION */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password <span className="text-red-400">*</span></label>
              <input type="password" name="password" value={registerForm.password} onChange={updateField} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm password <span className="text-red-400">*</span></label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* PROFILE IMAGE SECTION */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Profile Picture</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile image <span className="text-red-400">*</span></label>
            <input type="file" accept="image/*" onChange={onSelectFile} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white cursor-pointer file:bg-purple-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:cursor-pointer file:font-medium hover:bg-white/10 transition-colors" />
          </div>

          {/* If an image was selected, render the cropper so the user can select an exact square crop */}
          {imgSrc && (
            <div className="mt-4">
              <div className="relative w-full h-64 bg-black/20 rounded-lg border border-white/20 overflow-hidden">
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
              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm text-gray-300 font-medium">Zoom</label>
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-grow h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              </div>
              <div className="mt-4">
                {/* Reset image clears the selected file + crop preview so the user can pick a different file */}
                <button type="button" onClick={() => { setFile(null); setImgSrc(null); setCroppedAreaPixels(null); setZoom(1); }} className="text-sm text-purple-400 hover:text-purple-300 underline cursor-pointer transition-colors">Reset image</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex-grow">{error}</div>}
          {success && <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex-grow">{success}</div>}
          {!error && !success && <div className="flex-grow"></div>}
          <div className="flex gap-2">
            <button disabled={loading} type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-lg">{loading ? 'Registering...' : 'Register'}</button>
            <button type="button" onClick={() => navigate('/')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer border border-white/20">Cancel</button>
          </div>
        </div>
      </form>
    </section>
    </div>
  )
}
