import { useState } from 'react'
import StatusBadge from './StatusBadge'

function CartonCard({ carton, onEdit, onDelete, onCycleStatus }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const prefixColor = carton.prefix === 'B'
    ? 'bg-blue-600/20 text-blue-400 border-blue-600/30'
    : 'bg-amber-700/20 text-amber-400 border-amber-700/30'

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className={`flex-none w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg ${prefixColor}`}>
          {carton.prefix}{carton.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-300 text-sm font-medium">{carton.room || '—'}</span>
            <StatusBadge status={carton.status} onClick={() => onCycleStatus(carton.id)} />
          </div>
          {carton.description && (
            <p className="text-slate-500 text-xs mt-1 truncate">{carton.description}</p>
          )}
        </div>
        <div className="flex-none flex gap-1">
          <button
            onClick={() => onEdit(carton)}
            className="w-9 h-9 rounded-xl bg-slate-700 text-slate-400 flex items-center justify-center active:scale-95 transition-transform text-base"
          >
            ✏️
          </button>
          {confirmDelete ? (
            <button
              onClick={() => onDelete(carton.id)}
              className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center active:scale-95 transition-transform text-xs font-bold"
            >
              OK
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              onBlur={() => setConfirmDelete(false)}
              className="w-9 h-9 rounded-xl bg-slate-700 text-slate-400 flex items-center justify-center active:scale-95 transition-transform text-base"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      {carton.description && (
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">{carton.description}</p>
      )}
    </div>
  )
}

export default function CartonList({ cartons, onEdit, onDelete, onCycleStatus }) {
  const [filterRoom, setFilterRoom] = useState('all')
  const [filterPrefix, setFilterPrefix] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sort, setSort] = useState('number')

  const rooms = ['all', ...new Set(cartons.map(c => c.room).filter(Boolean))]

  const filtered = cartons
    .filter(c => filterRoom === 'all' || c.room === filterRoom)
    .filter(c => filterPrefix === 'all' || c.prefix === filterPrefix)
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .sort((a, b) => {
      if (sort === 'number') return a.prefix.localeCompare(b.prefix) || a.number - b.number
      if (sort === 'room') return (a.room || '').localeCompare(b.room || '')
      return 0
    })

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="space-y-2">
        <div className="flex gap-2">
          {['all', 'B', 'M'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPrefix(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterPrefix === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {p === 'all' ? 'Tous' : `Type ${p}`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['all', 'à emballer', 'emballé', 'déballé'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterStatus === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {s === 'all' ? 'Tous statuts' : s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {rooms.map(r => (
            <button
              key={r}
              onClick={() => setFilterRoom(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterRoom === r ? 'bg-slate-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {r === 'all' ? 'Toutes pièces' : r}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-500">Tri :</span>
          {['number', 'room'].map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                sort === s ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {s === 'number' ? 'Numéro' : 'Pièce'}
            </button>
          ))}
        </div>
      </div>

      {/* Résultat */}
      <p className="text-xs text-slate-500">{filtered.length} carton{filtered.length > 1 ? 's' : ''}</p>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-3xl mb-2">🔍</p>
          <p>Aucun carton pour ces filtres</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(c => (
          <CartonCard
            key={c.id}
            carton={c}
            onEdit={onEdit}
            onDelete={onDelete}
            onCycleStatus={onCycleStatus}
          />
        ))}
      </div>
    </div>
  )
}
