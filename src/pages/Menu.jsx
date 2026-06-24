import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Plus, Minus, Trash2, X, MessageSquare } from 'lucide-react'
import products from '../lib/products'
import CustomerModal from '../components/CustomerModal'

const categories = ['All', 'Coffee', 'Non-Coffee', 'Pastry']

export default function Menu() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [customizeProduct, setCustomizeProduct] = useState(null)
  const [noteInput, setNoteInput] = useState('')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [search, activeCategory])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const getCartKey = (product, notes) => {
    if (product.type === 'food') return `${product.id}`
    const noteKey = (notes || '').trim().toLowerCase()
    return `${product.id}-${noteKey}`
  }

  const addToCart = (product) => {
    if (product.type === 'drink') {
      setCustomizeProduct(product)
      setNoteInput('')
    } else {
      addToCartDirect(product, '')
    }
  }

  const addToCartDirect = (product, notes) => {
    const trimmedNotes = (notes || '').trim()
    const cartKey = getCartKey(product, trimmedNotes)
    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey)
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, {
        ...product,
        cartKey,
        quantity: 1,
        notes: product.type === 'drink' ? trimmedNotes : '',
      }]
    })
  }

  const handleConfirmCustomize = () => {
    if (customizeProduct) {
      addToCartDirect(customizeProduct, noteInput)
      setCustomizeProduct(null)
      setNoteInput('')
    }
  }

  const updateQty = (cartKey, delta) => {
    setCart((prev) =>
      prev.map((item) => item.cartKey === cartKey ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey))
  }

  const handleCustomerSubmit = (data) => {
    sessionStorage.setItem('currentCustomer', JSON.stringify(data))
    sessionStorage.setItem('currentOrder', JSON.stringify(cart))
    navigate('/dashboard')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-coffee-900">Menu</h1>
          <p className="text-coffee-600 text-sm mt-1">Pilih minuman & makanan favorit Anda</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="w-full sm:w-48 pl-9 pr-4 py-2 border border-coffee-200 rounded-xl text-sm focus:ring-2 focus:ring-coffee-400 outline-none"
            />
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 bg-coffee-700 hover:bg-coffee-800 text-white rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-coffee-700 text-white'
                : 'bg-coffee-100 text-coffee-700 hover:bg-coffee-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product, idx) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-coffee-100 overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="aspect-[4/3] overflow-hidden bg-coffee-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <span className="text-[10px] font-medium text-coffee-500 uppercase tracking-wider">{product.category}</span>
              <h3 className="font-semibold text-coffee-900 text-sm mt-0.5">{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-coffee-700">Rp {product.price.toLocaleString('id-ID')}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="w-8 h-8 bg-coffee-700 hover:bg-coffee-800 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Customize Modal - input catatan untuk minuman */}
      <AnimatePresence>
        {customizeProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCustomizeProduct(null)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-coffee-100">
                <img
                  src={customizeProduct.image}
                  alt={customizeProduct.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-coffee-900">{customizeProduct.name}</h3>
                  <p className="text-sm text-coffee-500">Rp {customizeProduct.price.toLocaleString('id-ID')}</p>
                </div>
                <button onClick={() => setCustomizeProduct(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notes input */}
              <div className="p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-coffee-800 mb-2">
                  <MessageSquare className="w-4 h-4 text-coffee-500" />
                  Catatan
                </label>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Contoh: less sugar, less ice, no ice, extra shot..."
                  className="w-full px-3 py-2.5 border border-coffee-200 rounded-xl text-sm focus:ring-2 focus:ring-coffee-400 outline-none resize-none h-20"
                />
                <p className="text-[10px] text-coffee-400 mt-1">Opsional - kosongkan jika tidak ada catatan</p>
              </div>

              {/* Confirm button */}
              <div className="p-4 pt-0">
                <button
                  onClick={handleConfirmCustomize}
                  className="w-full py-3 bg-coffee-700 hover:bg-coffee-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambahkan ke Keranjang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] flex flex-col shadow-2xl"
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-coffee-100">
                <h2 className="font-bold text-lg text-coffee-800">
                  Keranjang ({cartCount})
                </h2>
                <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">Belum ada pesanan</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartKey} className="flex items-center gap-3 bg-coffee-50 rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-coffee-800 text-sm truncate">{item.name}</p>
                        {item.notes && (
                          <p className="text-[10px] text-coffee-500 mt-0.5 italic">{item.notes}</p>
                        )}
                        <p className="text-coffee-600 text-xs">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.cartKey, -1)} className="w-7 h-7 bg-coffee-200 rounded-lg flex items-center justify-center hover:bg-coffee-300 transition-colors">
                          <Minus className="w-3.5 h-3.5 text-coffee-700" />
                        </button>
                        <span className="font-semibold text-coffee-800 text-sm w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.cartKey, 1)} className="w-7 h-7 bg-coffee-700 rounded-lg flex items-center justify-center hover:bg-coffee-800 transition-colors">
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button onClick={() => removeItem(item.cartKey)} className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors ml-1">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-coffee-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-coffee-600">Total</span>
                    <span className="font-bold text-coffee-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <button
                    onClick={() => { setShowCustomerModal(true); setShowCart(false) }}
                    className="w-full py-3 bg-coffee-700 hover:bg-coffee-800 text-white font-semibold rounded-xl transition-colors"
                  >
                    Lanjut ke Pembayaran
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomerModal
        open={showCustomerModal}
        onSubmit={handleCustomerSubmit}
        onClose={() => setShowCustomerModal(false)}
      />
    </div>
  )
}
