import { useState } from 'react'

export default function SyncSettings({ hasPat, onSave, onClear, syncing, lastSync, syncError }) {
  const [input, setInput] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!input.trim()) return
    onSave(input.trim())
    setInput('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200">Sync GitHub Gist</span>
          <span className={`flex items-center gap-1.5 text-xs ${hasPat ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasPat ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            {hasPat ? 'Connecté' : 'Non configuré'}
          </span>
        </div>

        {hasPat ? (
          <>
            {syncing && <p className="text-xs text-blue-400">Synchronisation…</p>}
            {syncError && <p className="text-xs text-red-400">Erreur : {syncError}</p>}
            {lastSync && !syncing && (
              <p className="text-xs text-slate-500">
                Dernière sync : {lastSync.toLocaleTimeString('fr-FR')}
              </p>
            )}
            <button
              onClick={onClear}
              className="w-full py-2.5 rounded-xl bg-red-900/40 text-red-400 text-sm font-medium active:scale-95 transition-transform"
            >
              Déconnecter
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-400">
              Entre ton Personal Access Token GitHub (scope <code className="text-slate-300">gist</code>) pour synchroniser les données entre appareils.
            </p>
            <input
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={!input.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40"
            >
              {saved ? 'Enregistré ✓' : 'Enregistrer'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
