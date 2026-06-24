import { Coffee } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-coffee-950 text-coffee-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coffee className="w-5 h-5" />
          <span className="text-white font-semibold">Casa Neira Coffee</span>
        </div>
        <p className="text-sm">Jl. Supratman No. 59, Cihapit, Kec. Bandung Wetan, Kota Bandung</p>
        <p className="text-xs text-coffee-500 mt-1">© {new Date().getFullYear()} Casa Neira Coffee. All rights reserved.</p>
      </div>
    </footer>
  )
}
