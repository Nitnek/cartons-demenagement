const config = {
  'à emballer': { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400', label: 'À emballer' },
  'emballé':    { bg: 'bg-amber-900/60', text: 'text-amber-300', dot: 'bg-amber-400', label: 'Emballé' },
  'déballé':    { bg: 'bg-emerald-900/60', text: 'text-emerald-300', dot: 'bg-emerald-400', label: 'Déballé' },
}

export default function StatusBadge({ status, onClick, className = '' }) {
  const c = config[status] ?? config['à emballer']
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} ${onClick ? 'active:scale-95 transition-transform' : ''} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </button>
  )
}
