import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function Navbar({ user, onLogout, dark, toggleDark, cartCount }) {
  const location = useLocation()

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-indigo-600 dark:text-indigo-400">Li-Fi Smart Canteen</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className={navClass(location.pathname === '/')} to="/">Menu</Link>
          <Link className={navClass(location.pathname === '/orders')} to="/orders">My Orders</Link>
          {user?.is_admin && (
            <Link className={navClass(location.pathname.startsWith('/admin'))} to="/admin">Admin</Link>
          )}
          <Link className={navClass(location.pathname === '/cart')} to="/cart">Cart{cartCount ? ` (${cartCount})` : ''}</Link>
          <button onClick={toggleDark} className="px-3 py-1 rounded border dark:border-gray-700">
            {dark ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <button onClick={onLogout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
          ) : (
            <Link to="/auth" className="px-3 py-1 rounded bg-indigo-600 text-white">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

function navClass(active){
  return `px-2 py-1 rounded ${active ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'}`
}
