import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Orders from './components/Orders'
import Admin from './components/Admin'

function App() {
  const [user, setUser] = useState(null)
  const [dark, setDark] = useState(false)
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    const u = localStorage.getItem('user'); if(u) setUser(JSON.parse(u))
  }, [])

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id)
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty+1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
  }
  const onLogout = () => { localStorage.removeItem('user'); localStorage.removeItem('token'); setUser(null); navigate('/') }
  const onAuthed = (u) => { setUser(u); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar user={user} onLogout={onLogout} dark={dark} toggleDark={()=>setDark(!dark)} cartCount={cart.reduce((s,i)=>s+i.qty,0)} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Menu addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} onOrderPlaced={(o)=>navigate('/orders')} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/auth" element={<Auth onAuthed={onAuthed} />} />
          <Route path="/admin" element={user?.is_admin ? <Admin /> : <Auth onAuthed={onAuthed} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
