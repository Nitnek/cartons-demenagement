import { useEffect } from 'react'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-lg leading-none active:scale-95 transition-transform"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
