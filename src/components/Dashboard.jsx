function StatCard({ value, label, color }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-1">
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}

function SegmentedBar({ aEmballer, emballes, deballes, total }) {
  if (!total) return null
  const pctA = (aEmballer / total) * 100
  const pctE = (emballes / total) * 100
  const pctD = (deballes / total) * 100
  return (
    <div className="flex w-full h-2.5 rounded-full overflow-hidden gap-0.5">
      {pctA > 0 && <div className="bg-slate-600 transition-all duration-500" style={{ width: `${pctA}%` }} />}
      {pctE > 0 && <div className="bg-amber-500 transition-all duration-500" style={{ width: `${pctE}%` }} />}
      {pctD > 0 && <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${pctD}%` }} />}
    </div>
  )
}

function RoomCard({ room, list }) {
  const total = list.length
  const aEmballer = list.filter(c => c.status === 'à emballer').length
  const emballes = list.filter(c => c.status === 'emballé').length
  const deballes = list.filter(c => c.status === 'déballé').length
  const done = emballes + deballes
  const allDone = done === total

  return (
    <div className={`bg-slate-800 rounded-2xl p-4 ${allDone ? 'ring-1 ring-emerald-500/40' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-slate-200">{room}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${allDone ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
          {allDone ? '✓ terminé' : `${done}/${total}`}
        </span>
      </div>
      <SegmentedBar aEmballer={aEmballer} emballes={emballes} deballes={deballes} total={total} />
      <div className="flex gap-3 mt-2.5 text-xs text-slate-500">
        {aEmballer > 0 && <span><span className="text-slate-400">{aEmballer}</span> à emballer</span>}
        {emballes > 0 && <span><span className="text-amber-400">{emballes}</span> emballé{emballes > 1 ? 's' : ''}</span>}
        {deballes > 0 && <span><span className="text-emerald-400">{deballes}</span> déballé{deballes > 1 ? 's' : ''}</span>}
      </div>
    </div>
  )
}

export default function Dashboard({ cartons }) {
  const total = cartons.length
  const emballes = cartons.filter(c => c.status === 'emballé').length
  const deballes = cartons.filter(c => c.status === 'déballé').length
  const aEmballer = cartons.filter(c => c.status === 'à emballer').length
  const pctEmballe = total ? Math.round((emballes / total) * 100) : 0
  const pctDeballe = total ? Math.round((deballes / total) * 100) : 0

  const blanc = cartons.filter(c => c.prefix === 'B').length
  const marron = cartons.filter(c => c.prefix === 'M').length

  const rooms = [...new Set(cartons.map(c => c.room).filter(Boolean))]
  const roomsDone = rooms.filter(room =>
    cartons.filter(c => c.room === room).every(c => c.status !== 'à emballer')
  ).length

  if (total === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-5xl mb-3">📦</p>
        <p className="font-medium text-slate-400">Aucun carton pour l'instant</p>
        <p className="text-sm mt-1">Appuie sur + pour commencer</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barre globale */}
      <div className="bg-slate-800 rounded-2xl p-4">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-sm text-slate-400">Progression globale</span>
          <span className="text-sm text-slate-400">{emballes + deballes}/{total} traités</span>
        </div>
        <SegmentedBar aEmballer={aEmballer} emballes={emballes} deballes={deballes} total={total} />
        <div className="flex items-center gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-600" />À emballer : {aEmballer}</span>
          <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500" />Emballé : {pctEmballe}%</span>
          <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" />Déballé : {pctDeballe}%</span>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard value={total} label={`carton${total > 1 ? 's' : ''}`} color="text-white" />
        <StatCard value={blanc} label={`blanc${blanc > 1 ? 's' : ''} (B)`} color="text-blue-400" />
        <StatCard value={marron} label={`marron${marron > 1 ? 's' : ''} (M)`} color="text-amber-400" />
      </div>

      {/* Pièces */}
      {rooms.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Par pièce</span>
            <span className="text-xs text-slate-500">{roomsDone}/{rooms.length} pièce{rooms.length > 1 ? 's' : ''} terminée{rooms.length > 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-3">
            {rooms.map(room => (
              <RoomCard
                key={room}
                room={room}
                list={cartons.filter(c => c.room === room)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
