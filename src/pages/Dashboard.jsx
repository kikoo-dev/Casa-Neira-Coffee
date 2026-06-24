import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { CreditCard, Printer, ArrowLeft, CheckCircle, Clock, User, ShoppingBag, Table2, UtensilsCrossed, FileText, Loader2, AlertCircle } from 'lucide-react'
import Receipt from '../components/Receipt'
import NotaPesanan from '../components/NotaPesanan'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function generateId(prefix) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${prefix}${result}`
}

export default function Dashboard() {
  const [order] = useState(() => {
    const saved = sessionStorage.getItem('currentOrder')
    return saved ? JSON.parse(saved) : []
  })
  const [customer] = useState(() => {
    const saved = sessionStorage.getItem('currentCustomer')
    return saved ? JSON.parse(saved) : null
  })
  const [paymentStep, setPaymentStep] = useState('idle')
  const [qrString, setQrString] = useState('')
  const [totalPayment, setTotalPayment] = useState(0)
  const [expiredAt, setExpiredAt] = useState('')
  const [payError, setPayError] = useState('')
  const [isCreatingQris, setIsCreatingQris] = useState(false)
  const receiptRef = useRef(null)
  const notaRef = useRef(null)
  const [receiptId] = useState(() => generateId('RCT-'))
  const [orderId] = useState(() => generateId('ORD-'))
  const pollingRef = useRef(null)

  const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceCharge = Math.round(subtotal * 0.08)
  const total = subtotal + serviceCharge

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  const checkPaymentStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/qris-status?order_id=${orderId}&amount=${total}`)
      const data = await res.json()
      if (data.success && data.data && data.data.status === 'completed') {
        stopPolling()
        setPaymentStep('success')
      }
    } catch {
      // silently retry
    }
  }, [orderId, total, stopPolling])

  const startPolling = useCallback(() => {
    stopPolling()
    pollingRef.current = setInterval(checkPaymentStatus, 5000)
  }, [checkPaymentStatus, stopPolling])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  const handlePay = async () => {
    setPayError('')
    setIsCreatingQris(true)
    try {
      const res = await fetch(`${API_URL}/api/qris-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          order_id: orderId,
        }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setQrString(data.data.payment_number)
        setTotalPayment(data.data.total_payment || total)
        setExpiredAt(data.data.expired_at || '')
        setPaymentStep('qr')
        startPolling()
      } else {
        setPayError(data.error || 'Gagal membuat QRIS. Silakan coba lagi.')
      }
    } catch {
      setPayError('Tidak dapat terhubung ke server. Pastikan server backend berjalan.')
    } finally {
      setIsCreatingQris(false)
    }
  }

  const handleCancel = () => {
    stopPolling()
    setPaymentStep('idle')
    setQrString('')
    setPayError('')
  }

  const printReceipt = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Casa Neira Coffe</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #fff; font-family: 'Courier New', Courier, monospace; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${receiptRef.current?.innerHTML || ''}</body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => { printWindow.print() }, 500)
  }

  const printNota = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Nota Pesanan Casa Neira Coffee</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #fff; font-family: 'Courier New', Courier, monospace; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${notaRef.current?.innerHTML || ''}</body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => { printWindow.print() }, 500)
  }

  const resetOrder = () => {
    sessionStorage.removeItem('currentOrder')
    sessionStorage.removeItem('currentCustomer')
    stopPolling()
    setPaymentStep('idle')
  }

  if (!customer || order.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-coffee-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-coffee-800 mb-2">Belum Ada Pesanan</h2>
        <p className="text-coffee-600 mb-6">Silakan pilih menu terlebih dahulu.</p>
        <a
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-coffee-700 text-white rounded-xl font-semibold hover:bg-coffee-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Menu
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-6">
        <a href="/menu" className="text-coffee-500 hover:text-coffee-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <h1 className="text-2xl font-bold text-coffee-900">Dashboard Pesanan</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-5"
          >
            <h2 className="font-semibold text-coffee-800 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Data Pelanggan
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-3 p-3 bg-coffee-50 rounded-xl">
                <User className="w-5 h-5 text-coffee-500" />
                <div>
                  <p className="text-xs text-coffee-500">Nama</p>
                  <p className="font-medium text-coffee-800">{customer.name}</p>
                </div>
              </div>
              {customer.orderType === 'Dine In' && (
                <div className="flex items-center gap-3 p-3 bg-coffee-50 rounded-xl">
                  <Table2 className="w-5 h-5 text-coffee-500" />
                  <div>
                    <p className="text-xs text-coffee-500">Meja</p>
                    <p className="font-medium text-coffee-800">{customer.tableNo}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-coffee-50 rounded-xl">
                {customer.orderType === 'Dine In' ? (
                  <UtensilsCrossed className="w-5 h-5 text-coffee-500" />
                ) : (
                  <ShoppingBag className="w-5 h-5 text-coffee-500" />
                )}
                <div>
                  <p className="text-xs text-coffee-500">Tipe</p>
                  <p className="font-medium text-coffee-800">{customer.orderType}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-coffee-800 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Detail Pesanan
              </h2>
              {paymentStep === 'idle' && (
                <button
                  onClick={printNota}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-coffee-100 hover:bg-coffee-200 text-coffee-700 rounded-lg text-xs font-medium transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Cetak Nota
                </button>
              )}
            </div>
            <div className="space-y-2">
              {order.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-coffee-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-coffee-800 text-sm">{item.name}</p>
                      {item.notes && (
                        <p className="text-[10px] text-coffee-400 italic">{item.notes}</p>
                      )}
                      <p className="text-xs text-coffee-500">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-coffee-700">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-coffee-100 space-y-1 text-sm">
              <div className="flex justify-between text-coffee-600">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-coffee-600">
                <span>Service (8%)</span>
                <span>Rp {serviceCharge.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-coffee-900 pt-2 border-t border-coffee-100">
                <span>Grand Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {paymentStep === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-5"
            >
              <h2 className="font-semibold text-coffee-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Pembayaran
              </h2>
              <p className="text-sm text-coffee-600 mb-4">
                Pilih metode pembayaran QRIS untuk menyelesaikan pesanan.
              </p>
              {payError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-600">{payError}</p>
                </div>
              )}
              <button
                onClick={handlePay}
                disabled={isCreatingQris}
                className="w-full py-3 bg-coffee-700 hover:bg-coffee-800 disabled:bg-coffee-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isCreatingQris ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuat QRIS...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Bayar dengan QRIS
                  </>
                )}
              </button>
            </motion.div>
          )}

          {paymentStep === 'qr' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-5 text-center"
            >
              <h2 className="font-semibold text-coffee-800 mb-4">Scan QRIS</h2>
              <div className="bg-white p-4 rounded-xl inline-block shadow-sm border border-coffee-100 mb-4">
                <QRCodeSVG
                  value={qrString}
                  size={200}
                  level="M"
                  includeMargin
                />
              </div>
              <p className="text-sm text-coffee-600 mb-1">Scan QR code di atas untuk membayar</p>
              <p className="font-bold text-lg text-coffee-900 mb-1">Rp {totalPayment.toLocaleString('id-ID')}</p>
              <p className="text-xs text-coffee-500 mb-1">Pesanan ID: {orderId}</p>
              {expiredAt && (
                <p className="text-xs text-red-500 mb-3">
                  Berlaku hingga: {new Date(expiredAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              )}
              <p className="text-xs text-coffee-400 mb-4 flex items-center justify-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Menunggu pembayaran...
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentStep('success')}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Konfirmasi Bayar
                </button>
                <button
                  onClick={handleCancel}
                  className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors text-sm"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          )}

          {paymentStep === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-green-200 p-5 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              </motion.div>
              <h2 className="text-lg font-bold text-green-700 mb-1">Pembayaran Berhasil!</h2>
              <p className="text-sm text-coffee-600 mb-4">Pesanan sedang diproses</p>

              <div className="bg-coffee-50 rounded-xl p-3 mb-4 space-y-1 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-coffee-500">Receipt ID</span>
                  <span className="font-medium text-coffee-800">{receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coffee-500">Pesanan ID</span>
                  <span className="font-medium text-coffee-800">{orderId}</span>
                </div>
                <div className="flex items-center gap-2 text-coffee-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2 text-coffee-600">
                  <User className="w-3.5 h-3.5" />
                  <span>{customer.name}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-coffee-200 font-bold">
                  <span>Grand Total</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={printReceipt}
                  className="w-full py-3 bg-coffee-700 hover:bg-coffee-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Struk
                </button>
                <button
                  onClick={printNota}
                  className="w-full py-3 bg-coffee-100 hover:bg-coffee-200 text-coffee-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Cetak Nota Pesanan
                </button>
                <a
                  href="/menu"
                  onClick={resetOrder}
                  className="w-full py-3 bg-coffee-50 hover:bg-coffee-100 text-coffee-600 font-semibold rounded-xl transition-colors text-sm text-center"
                >
                  Pesan Lagi
                </a>
              </div>
            </motion.div>
          )}

          <div className="hidden">
            <Receipt ref={receiptRef} order={order} customer={customer} subtotal={subtotal} serviceCharge={serviceCharge} total={total} receiptId={receiptId} orderId={orderId} />
          </div>

          <div className="hidden">
            <NotaPesanan ref={notaRef} order={order} customer={customer} orderId={orderId} />
          </div>
        </div>
      </div>
    </div>
  )
}
