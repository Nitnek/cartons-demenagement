export default function Dashboard({ cartons }) {
  const total = cartons.length
  const emballes = cartons.filter(c => c.status === 'emballé').length
  const debалles = cartons.filter(c => c.status === 'déballé').length
  const aEmballer = cartons.filter(c => c.status === 'à emballer').length

  const rooms = [...new Set(cartons.map(c => c.room).filter(Boolean))]
  const byRoom = rooms.map(room => {
    const list = cartons.filter(c => c.room === room)
    const done = list.filter(c => c.status !== 'à emballer').length
    return { room, total: list.length, done }
  })

  const pct = total ? Math.round(((emballes + debалles) / total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Progression globale */}
      <div className="bg-slate-800 rounded-2xl p-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-slate-400">Progression globale</span>
          <span className="text-2xl font-bold text-white">{pct}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-400">
          <span><span className="text-slate-300 font-semibold">{total}</span> carton{total > 1 ? 's' : ''}</span>
          <span><span className="text-amber-400 font-semibold">{emballes}</span> emballé{emballes > 1 ? 's' : ''}</span>
          <span><span className="text-slate-400 font-semibold">{aEmballer}</span> restant{aEmballer > 1 ? 's' : ''}</span>
          <span><span className="text-emerald-400 font-semibold">{debалles}</span> déballé{debалles > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Par pièce */}
      {byRoom.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-sm text-slate-400 mb-3">Par pièce</p>
          <div className="space-y-2.5">
            {byRoom.map(({ room, total, done }) => (
              <div key={room}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-200">{room}</span>
                  <span className="text-slate-400">{done}/{total}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: total ? `${Math.round((done / total) * 100)}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-4xl mb-2">📦</p>
          <p>Aucun carton pour l'instant</p>
        </div>
      )}
    </div>
  )
}
