import { useState } from 'react'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const hash = await sha256(password)
    if (hash === import.meta.env.VITE_PASSWORD_HASH) {
      sessionStorage.setItem('auth', '1')
      onSuccess()
    } else {
      setError(true)
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📦</div>
          <h1 className="text-2xl font-bold text-white">Déménagement</h1>
          <p className="text-slate-500 text-sm mt-1">Accès privé</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Mot de passe"
              autoFocus
              className={`w-full bg-slate-800 border rounded-2xl px-4 py-4 text-white text-base focus:outline-none transition-colors ${
                error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'
              }`}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">Mot de passe incorrect</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base active:scale-95 transition-transform disabled:opacity-40"
          >
            {loading ? '…' : 'Entrer'}
          </button>
        </form>
      </div>
    </div>
  )
}
