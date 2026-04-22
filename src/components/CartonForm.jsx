import { useState, useEffect } from 'react'

const ROOMS = ['Salon', 'Cuisine', 'Chambre parents', 'Chambre enfant', 'Salle de bain', 'Bureau', 'Cave', 'Garage', 'Couloir']
const STATUSES = ['à emballer', 'emballé', 'déballé']

export default function CartonForm({ initial, suggestedNumber, onSave, onCancel }) {
  const [prefix, setPrefix] = useState(initial?.prefix ?? 'B')
  const [number, setNumber] = useState(initial?.number ?? suggestedNumber ?? 1)
  const [room, setRoom] = useState(initial?.room ?? '')
  const [customRoom, setCustomRoom] = useState('')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'à emballer')

  useEffect(() => {
    if (initial?.room && !ROOMS.includes(initial.room)) {
      setRoom('__custom__')
      setCustomRoom(initial.room)
    }
  }, [])

  useEffect(() => {
    if (!initial) setNumber(suggestedNumber)
  }, [prefix, suggestedNumber])

  function handleSubmit(e) {
    e.preventDefault()
    const finalRoom = room === '__custom__' ? customRoom.trim() : room
    onSave({ prefix, number: parseInt(number, 10), room: finalRoom, description, status })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Préfixe + Numéro */}
      <div className="flex gap-3">
        <div className="flex-none">
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <div className="flex rounded-xl overflow-hidden border border-slate-700">
            {['B', 'M'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPrefix(p)}
                className={`px-5 py-3 text-sm font-semibold transition-colors ${
                  prefix === p
                    ? p === 'B' ? 'bg-blue-600 text-white' : 'bg-amber-700 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1">Numéro</label>
          <input
            type="number"
            min="1"
            value={number}
            onChange={e => setNumber(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Aperçu */}
      <div className="text-center">
        <span className="text-3xl font-bold text-white">{prefix}{number}</span>
      </div>

      {/* Pièce */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Pièce</label>
        <select
          value={room}
          onChange={e => setRoom(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Choisir une pièce…</option>
          {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
          <option value="__custom__">Autre…</option>
        </select>
        {room === '__custom__' && (
          <input
            type="text"
            placeholder="Nom de la pièce"
            value={customRoom}
            onChange={e => setCustomRoom(e.target.value)}
            className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            required
          />
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Contenu</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Ex : livres, câbles, vaisselle…"
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {/* Statut */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Statut</label>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                status === s
                  ? s === 'à emballer' ? 'bg-slate-600 text-white'
                    : s === 'emballé' ? 'bg-amber-700 text-white'
                    : 'bg-emerald-700 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium active:scale-95 transition-transform"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold active:scale-95 transition-transform"
        >
          {initial ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}
