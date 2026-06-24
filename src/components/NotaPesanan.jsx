import { forwardRef } from 'react'

const s = {
  container: {
    background: '#fff',
    width: '300px',
    padding: '20px 16px',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '12px',
    color: '#1a1a1a',
    margin: '0 auto',
  },
  header: { textAlign: 'center', borderBottom: '2px dashed #aaa', paddingBottom: '10px', marginBottom: '10px' },
  title: { fontSize: '14px', fontWeight: 'bold' },
  subtitle: { fontSize: '10px', color: '#888', marginTop: '2px' },
  infoBlock: { borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '10px' },
  infoRow: { marginBottom: '2px', fontSize: '11px' },
  infoLabel: { color: '#888' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginTop: '4px' },
  th: { textAlign: 'left', padding: '4px 2px', borderBottom: '1px solid #ccc', fontWeight: 'bold', fontSize: '10px' },
  td: { padding: '4px 2px', borderBottom: '1px solid #eee', verticalAlign: 'top' },
  tdNote: { padding: '4px 2px', borderBottom: '1px solid #eee', color: '#888', verticalAlign: 'top', fontSize: '10px' },
  footer: { textAlign: 'center', fontSize: '9px', color: '#aaa', borderTop: '1px dashed #ccc', paddingTop: '8px', marginTop: '8px' },
}

const NotaPesanan = forwardRef(({ order, customer, orderId }, ref) => {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <div ref={ref} style={s.container}>
      <div style={s.header}>
        <div style={s.title}>Casa Neira Coffee</div>
        <div style={s.subtitle}>Nota Pesanan</div>
      </div>

      <div style={s.infoBlock}>
        <div style={s.infoRow}><span style={s.infoLabel}>Pesanan ID</span> : {orderId}</div>
        <div style={s.infoRow}><span style={s.infoLabel}>Pelanggan</span> : {customer.name}</div>
        <div style={s.infoRow}><span style={s.infoLabel}>Waktu</span> : {timeStr}</div>
        {customer.orderType === 'Dine In' && customer.tableNo && (
          <div style={s.infoRow}><span style={s.infoLabel}>Meja</span> : {customer.tableNo}</div>
        )}
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <td style={s.th}>Qty</td>
            <td style={s.th}>Menu</td>
            <td style={s.th}>Catatan</td>
          </tr>
        </thead>
        <tbody>
          {order.map((item, idx) => (
            <tr key={idx}>
              <td style={s.td}>{item.quantity}x</td>
              <td style={s.td}>{item.name}</td>
              <td style={s.tdNote}>{item.notes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={s.footer}>
        Terima kasih! Pesanan sedang diproses
      </div>
    </div>
  )
})

NotaPesanan.displayName = 'NotaPesanan'
export default NotaPesanan
