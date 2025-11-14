import { useEffect, useState } from 'react'

export default function Orders(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [orders, setOrders] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const load = async () => {
    if(!user) return
    const res = await fetch(`${baseUrl}/api/orders/user/${user.id}`)
    const data = await res.json()
    setOrders(data)
  }

  useEffect(()=>{ load(); const t=setInterval(load, 4000); return ()=>clearInterval(t) }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {orders.map(o => (
        <div key={o.id} className="rounded border p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Order #{o.id.slice(-6)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Status: {o.status}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total: ₹{o.total.toFixed(2)} | ETA: {o.eta_minutes} mins</p>
            </div>
            <div className="text-xs text-gray-500">
              {o.qr_code && <QR code={o.qr_code} />}
            </div>
          </div>
          <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
            {o.items.map((i,idx)=>(<li key={idx}>{i.title} x {i.qty} @ ₹{i.price}</li>))}
          </ul>
        </div>
      ))}
      {orders.length===0 && <p className="text-center text-gray-500">No orders yet.</p>}
    </div>
  )
}

function QR({ code }){
  // simple ASCII QR-like block representation
  const hash = Array.from(code).reduce((a,c)=>a + c.charCodeAt(0),0)
  const size = 8
  const grid = Array.from({length:size}, (_,r)=>Array.from({length:size}, (_,c)=>((r*size+c+hash)%3===0)))
  return (
    <div className="grid grid-cols-8 gap-0.5">
      {grid.flat().map((on,idx)=>(<div key={idx} className={`w-2 h-2 ${on?'bg-black':'bg-white'} border border-gray-300`}></div>))}
    </div>
  )
}
