import { useMemo, useState } from 'react'

export default function Cart({ cart, setCart, onOrderPlaced }){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [pay, setPay] = useState('cash')
  const [placing, setPlacing] = useState(false)
  const [lifiGlow, setLifiGlow] = useState(false)

  const total = useMemo(()=>cart.reduce((s,i)=>s + i.price * i.qty, 0), [cart])
  const eta = useMemo(()=>Math.max(10, cart.length*5), [cart])

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }
  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if(!user){
      alert('Please login first')
      return
    }
    setPlacing(true)
    try{
      const payload = {
        user_id: user.id,
        items: cart.map(i=>({ item_id: i.id, title: i.title, qty: i.qty, price: i.price })),
        payment_method: pay
      }
      const res = await fetch(`${baseUrl}/api/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if(!res.ok) throw new Error('Failed to create order')
      const order = await res.json()
      // Simulate Li-Fi transfer visual
      setLifiGlow(true)
      await new Promise(r=>setTimeout(r, 1200))
      setLifiGlow(false)
      // Call lifi endpoint to ack
      await fetch(`${baseUrl}/api/lifi/send`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ order_id: order.id, payload: { type:'order' } }) })
      setCart([])
      onOrderPlaced(order)
    } catch(e){
      alert(e.message)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className={`rounded-lg border p-4 bg-white dark:bg-gray-800 ${lifiGlow ? 'ring-4 ring-indigo-400 transition' : ''}`}>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          <div className="space-y-3">
            {cart.map(i => (
              <div key={i.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{i.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">₹{i.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 border" onClick={()=>updateQty(i.id, -1)}>-</button>
                  <span>{i.qty}</span>
                  <button className="px-2 border" onClick={()=>updateQty(i.id, 1)}>+</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={()=>remove(i.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t flex items-center justify-between">
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p>Total: <span className="font-semibold">₹{total.toFixed(2)}</span></p>
                <p>Estimated prep time: <span className="font-semibold">{eta} mins</span></p>
              </div>
              <div className="flex items-center gap-2">
                <select className="border rounded px-2 py-1 dark:bg-gray-900" value={pay} onChange={e=>setPay(e.target.value)}>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
                <button disabled={placing} onClick={placeOrder} className="px-4 py-2 bg-indigo-600 text-white rounded">{placing ? 'Placing...' : 'Place Order (Li-Fi)'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
