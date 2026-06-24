import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Table2, UtensilsCrossed, ShoppingBag } from 'lucide-react'

export default function CustomerModal({ open, onSubmit, onClose }) {
  const [name, setName] = useState('')
  const [tableNo, setTableNo] = useState('')
  const [orderType, setOrderType] = useState('Dine In')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), tableNo: tableNo.trim() || '—', orderType })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-coffee-800">Data Diri</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('Dine In')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    orderType === 'Dine In'
                      ? 'border-coffee-700 bg-coffee-50 text-coffee-800'
                      : 'border-coffee-200 text-coffee-500 hover:border-coffee-300'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Dine In
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('Take Away')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    orderType === 'Take Away'
                      ? 'border-coffee-700 bg-coffee-50 text-coffee-800'
                      : 'border-coffee-200 text-coffee-500 hover:border-coffee-300'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Take Away
                </button>
              </div>

              {orderType === 'Dine In' && (
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1">
                    <Table2 className="w-4 h-4 inline mr-1" />
                    No. Meja
                  </label>
                  <input
                    type="text"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    placeholder="Contoh: 12"
                    className="w-full px-4 py-2.5 border border-coffee-200 rounded-xl focus:ring-2 focus:ring-coffee-400 focus:border-coffee-400 outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-coffee-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-2.5 border border-coffee-200 rounded-xl focus:ring-2 focus:ring-coffee-400 focus:border-coffee-400 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-coffee-700 hover:bg-coffee-800 text-white font-semibold rounded-xl transition-colors"
              >
                Lanjutkan
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
