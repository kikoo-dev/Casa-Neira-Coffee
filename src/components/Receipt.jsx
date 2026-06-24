import { forwardRef } from 'react'

const Receipt = forwardRef(({ order, customer, subtotal, serviceCharge, total, receiptId, orderId }, ref) => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const payTimeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  // Kumpulkan semua catatan dari item minuman
  const allNotes = order
    .filter((item) => item.notes && item.notes.trim())
    .map((item) => `${item.name}: ${item.notes}`)

  return (
    <div ref={ref} className="receipt-content">
      {/* Header */}
      <div className="receipt-header">
        <div className="store-name">Casa Neira Coffe</div>
        <div className="store-address">
          Jl. Supratman No. 59, Cihapit, Kec. Bandung<br />
          Wetan, Kota Bandung
          {customer.orderType === 'Dine In' && customer.tableNo && (
            <><br />Table No: {customer.tableNo}</>
          )}
        </div>
      </div>

      <hr className="divider" />

      {/* Info Transaksi */}
      <div className="info-row"><span className="label">{dateStr}</span><span>{timeStr}</span></div>
      <div className="info-row"><span className="label">Receipt ID</span><span>{receiptId}</span></div>
      <div className="info-row"><span className="label">Pesanan ID</span><span>{orderId}</span></div>
      <div className="info-row"><span className="label">Pelanggan</span><span>{customer.name}</span></div>

      <hr className="divider-solid" />
      <span className="badge">{`\u2014 ${customer.orderType.toUpperCase()} \u2014`}</span>
      <hr className="divider-solid" />

      {/* Item Pesanan */}
      {order.map((item, idx) => (
        <div key={idx} className="item-row">
          <span className="item-name">{item.name}</span>
          <span className="item-qty">x{item.quantity}</span>
          <span className="item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
        </div>
      ))}

      <hr className="divider" />

      {/* Ringkasan Harga */}
      <div className="total-row"><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
      <div className="total-row"><span>Service (8%)</span><span>Rp {serviceCharge.toLocaleString('id-ID')}</span></div>

      <hr className="divider-solid" />

      <div className="total-row grand"><span>Grand Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>

      <hr className="divider" />

      {/* Info Pembayaran */}
      <div className="payment-row"><span>Metode Pembayaran</span><span className="val">QRIS</span></div>
      <div className="payment-row"><span>Status</span><span className="val">Paid</span></div>
      <div className="payment-row"><span>Waktu Pembayaran</span><span className="val">{payTimeStr}</span></div>

      <hr className="divider" />

      {/* Footer */}
      <div className="footer">
        <div className="tagline">Thank You! Enjoy your coffee!</div>
        {allNotes.length > 0 && (
          <div>Notes: {allNotes.join(' | ')}</div>
        )}
        <div>Password wifi: ngopilagikak</div>
        <div>menu/reservation/more info: @casaneira on instagram</div>
      </div>
    </div>
  )
})

Receipt.displayName = 'Receipt'
export default Receipt
