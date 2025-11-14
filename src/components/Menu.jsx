import { useEffect, useState } from 'react'

export default function Menu({ addToCart }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{ fetchMenu() }, [])

  const fetchMenu = async () => {
    setLoading(true)
    try{
      const res = await fetch(`${baseUrl}/api/menu`)
      const data = await res.json()
      setItems(data)
    } finally { setLoading(false) }
  }

  if (loading) return <p className="text-center text-gray-500">Loading menu...</p>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover" />
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600">No Image</div>
          )}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{item.price.toFixed(2)}</span>
              <button disabled={!item.available} onClick={()=>addToCart(item)} className={`px-3 py-1 rounded ${item.available ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>{item.available ? 'Add' : 'Unavailable'}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
