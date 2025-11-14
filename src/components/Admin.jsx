import { useEffect, useState } from 'react'

export default function Admin(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title:'', description:'', price:0, image_url:'', available:true })
  const [orders, setOrders] = useState([])
  const [notice, setNotice] = useState('')

  const loadMenu = async () => {
    const res = await fetch(`${baseUrl}/api/menu`)
    setItems(await res.json())
  }
  const loadOrders = async () => {
    const res = await fetch(`${baseUrl}/api/orders`)
    setOrders(await res.json())
  }

  useEffect(()=>{ loadMenu(); loadOrders(); const t=setInterval(()=>{loadOrders()}, 3000); return ()=>clearInterval(t) }, [])

  const saveItem = async () => {
    const res = await fetch(`${baseUrl}/api/menu`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, price: parseFloat(form.price) }) })
    if(res.ok){ setForm({ title:'', description:'', price:0, image_url:'', available:true }); loadMenu() }
  }
  const updateItem = async (id, patch) => {
    const res = await fetch(`${baseUrl}/api/menu/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(patch) })
    if(res.ok) loadMenu()
  }
  const delItem = async (id) => {
    const res = await fetch(`${baseUrl}/api/menu/${id}`, { method:'DELETE' })
    if(res.ok) loadMenu()
  }

  const setStatus = async (id, status) => {
    const res = await fetch(`${baseUrl}/api/orders/${id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) })
    if(res.ok){
      setNotice(status === 'Ready' ? '🔔 Order is Ready!' : '')
      loadOrders()
    }
  }

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 rounded border p-4">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Menu Management</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2 dark:bg-gray-900" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <input className="border rounded px-3 py-2 dark:bg-gray-900" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
          <input className="border rounded px-3 py-2 sm:col-span-2 dark:bg-gray-900" placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})} />
          <textarea className="border rounded px-3 py-2 sm:col-span-2 dark:bg-gray-900" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={form.available} onChange={e=>setForm({...form, available:e.target.checked})} /> Available</label>
          <button onClick={saveItem} className="bg-indigo-600 text-white rounded px-4 py-2">Add Item</button>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {items.map(i => (
            <div key={i.id} className="border rounded p-3 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <p className="font-medium">{i.title} - ₹{i.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button className="px-2 rounded border" onClick={()=>updateItem(i.id, { available: !i.available })}>{i.available ? 'Disable' : 'Enable'}</button>
                  <button className="px-2 rounded border" onClick={()=>delItem(i.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded border p-4">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Live Orders</h3>
        {notice && <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded">{notice}</div>}
        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
          {orders.map(o => (
            <div key={o.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #{o.id.slice(-6)} - ₹{o.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{o.items.map(i=>`${i.title}x${i.qty}`).join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  {['Pending','Preparing','Ready','Completed'].map(s => (
                    <button key={s} onClick={()=>setStatus(o.id, s)} className={`px-2 py-1 rounded text-sm ${o.status===s?'bg-indigo-600 text-white':'border'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
