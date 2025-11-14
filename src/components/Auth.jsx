import { useState } from 'react'

export default function Auth({ onAuthed }){
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', is_admin:false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isSignup) {
        const res = await fetch(`${baseUrl}/api/auth/signup`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
        if(!res.ok) throw new Error((await res.json()).detail || 'Signup failed')
        setIsSignup(false)
      } else {
        const res = await fetch(`${baseUrl}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: form.email, password: form.password }) })
        if(!res.ok) throw new Error((await res.json()).detail || 'Login failed')
        const data = await res.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onAuthed(data.user)
      }
    } catch(err){
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{isSignup ? 'Sign Up' : 'Login'}</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignup && (
          <input className="w-full border rounded px-3 py-2 dark:bg-gray-900" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        )}
        <input className="w-full border rounded px-3 py-2 dark:bg-gray-900" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input type="password" className="w-full border rounded px-3 py-2 dark:bg-gray-900" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {isSignup && (
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" checked={form.is_admin} onChange={e=>setForm({...form, is_admin:e.target.checked})} /> Register as Admin</label>
        )}
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded py-2">{loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Login')}</button>
      </form>
      <button onClick={()=>setIsSignup(!isSignup)} className="mt-3 text-sm text-indigo-600">{isSignup ? 'Have an account? Login' : "New here? Sign up"}</button>
    </div>
  )
}
