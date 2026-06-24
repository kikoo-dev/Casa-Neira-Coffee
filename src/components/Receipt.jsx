import { forwardRef } from 'react'

const s = {
  container: {
    background: '#fff',
    width: '320px',
    padding: '24px 20px',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '13px',
    color: '#1a1a1a',
    margin: '0 auto',
  },
  header: { textAlign: 'center', marginBottom: '16px' },
  storeName: { fontSize: '17px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '0.5px' },
  storeAddr: { fontSize: '12px', color: '#555', lineHeight: 1.6 },
  dashedHr: { border: 'none', borderTop: '1px dashed #aaa', margin: '12px 0' },
  solidHr: { border: 'none', borderTop: '1px solid #ccc', margin: '12px 0' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' },
  infoLabel: { color: '#888' },
  badge: { textAlign: 'center', fontSize: '11px', letterSpacing: '0.1em', color: '#555', margin: '8px 0' },
  itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '2px' },
  itemName: { flex: 1, fontSize: '12px' },
  itemQty: { width: '36px', textAlign: 'center', color: '#777', fontSize: '12px' },
  itemPrice: { textAlign: 'right', fontSize: '12px' },
  itemNote: { fontSize: '10px', color: '#999', fontStyle: 'italic', marginLeft: '4px', marginBottom: '6px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '12px' },
  grandTotal: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginBottom: '3px' },
  payRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '12px' },
  payVal: { fontWeight: 'bold' },
  footer: { textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#666', lineHeight: 1.8 },
  footerTagline: { fontSize: '13px', color: '#1a1a1a', marginBottom: '4px' },
}

const Receipt = forwardRef(({ order, customer, subtotal, serviceCharge, total, receiptId, orderId }, ref) => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const payTimeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div ref={ref} style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.storeName}>Casa Neira Coffe</div>
        <div style={s.storeAddr}>
          Jl. Supratman No. 59, Cihapit, Kec. Bandung<br />Wetan, Kota Bandung
          {customer.orderType === 'Dine In' && customer.tableNo && <><br />Table No: {customer.tableNo}</>}
        </div>
      </div>

      <hr style={s.dashedHr} />

      {/* Info Transaksi */}
      <div style={s.infoRow}><span style={s.infoLabel}>{dateStr}</span><span>{timeStr}</span></div>
      <div style={s.infoRow}><span style={s.infoLabel}>Receipt ID</span><span>{receiptId}</span></div>
      <div style={s.infoRow}><span style={s.infoLabel}>Pesanan ID</span><span>{orderId}</span></div>
      <div style={s.infoRow}><span style={s.infoLabel}>Pelanggan</span><span>{customer.name}</span></div>

      <hr style={s.solidHr} />
      <div style={s.badge}>&mdash; {customer.orderType.toUpperCase()} &mdash;</div>
      <hr style={s.solidHr} />

      {/* Item Pesanan */}
      {order.map((item, idx) => (
        <div key={idx}>
          <div style={s.itemRow}>
            <span style={s.itemName}>{item.name}</span>
            <span style={s.itemQty}>x{item.quantity}</span>
            <span style={s.itemPrice}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
          </div>
          {item.notes && <div style={s.itemNote}>{item.notes}</div>}
        </div>
      ))}

      <hr style={s.dashedHr} />

      {/* Ringkasan Harga */}
      <div style={s.totalRow}><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
      <div style={s.totalRow}><span>Service (8%)</span><span>Rp {serviceCharge.toLocaleString('id-ID')}</span></div>

      <hr style={s.solidHr} />

      <div style={s.grandTotal}><span>Grand Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>

      <hr style={s.dashedHr} />

      {/* Info Pembayaran */}
      <div style={s.payRow}><span>Metode Pembayaran</span><span style={s.payVal}>QRIS</span></div>
      <div style={s.payRow}><span>Status</span><span style={s.payVal}>Paid</span></div>
      <div style={s.payRow}><span>Waktu Bayar</span><span style={s.payVal}>{payTimeStr}</span></div>

      <hr style={s.dashedHr} />

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.footerTagline}>Thank You! Enjoy your coffee!</div>
        <div>Password wifi: ngopilagikak</div>
        <div>IG: @casaneira</div>
      </div>
    </div>
  )
})

Receipt.displayName = 'Receipt'
export default Receipt
