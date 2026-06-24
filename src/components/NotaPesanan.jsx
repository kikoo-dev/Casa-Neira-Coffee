import { forwardRef } from 'react'
import { Coffee } from 'lucide-react'

const NotaPesanan = forwardRef(({ order, customer, orderId }, ref) => {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <div ref={ref} className="bg-white p-4 w-[80mm] text-xs leading-relaxed">
      <div className="text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Coffee className="w-4 h-4" />
          <span className="font-bold text-sm">Casa Neira Coffee</span>
        </div>
        <p className="text-[10px] text-gray-600">Nota Pesanan</p>
      </div>

      <div className="mb-3 pb-3 border-b border-dashed border-gray-300">
        <p className="font-bold">Pesanan ID: {orderId}</p>
        <p>Pelanggan: {customer.name}</p>
        <p>Table No: {customer.tableNo}</p>
        <p>Waktu: {timeStr}</p>
      </div>

      <div className="mb-3">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-gray-300 font-bold">
              <td className="w-8">Qty</td>
              <td className="w-6">Menu</td>
              <td>Catatan</td>
            </tr>
          </thead>
          <tbody>
            {order.map((item, idx) => {
              const notes = []
              if (item.sugar === 'Less Sugar') notes.push('Less Sugar')
              if (item.ice === 'Less Ice') notes.push('Less Ice')
              const noteStr = notes.length > 0 ? notes.join(', ') : null
              return (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-1">{item.quantity}x</td>
                  <td className="py-1">{item.name}</td>
                  <td className="py-1 text-gray-500">{noteStr || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center text-[9px] text-gray-400 border-t border-dashed border-gray-300 pt-3">
        <p>Terima kasih! Pesanan sedang diproses</p>
      </div>
    </div>
  )
})

NotaPesanan.displayName = 'NotaPesanan'
export default NotaPesanan
