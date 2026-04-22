import { useState } from 'react'
import { useCartons } from './hooks/useCartons'
import Dashboard from './components/Dashboard'
import CartonList from './components/CartonList'
import CartonForm from './components/CartonForm'
import Modal from './components/Modal'

const TABS = [
  { id: 'dashboard', label: 'Accueil', icon: '📊' },
  { id: 'list', label: 'Cartons', icon: '📦' },
]

export default function App() {
  const { cartons, addCarton, updateCarton, deleteCarton, cycleStatus, nextNumber } = useCartons()
  const [tab, setTab] = useState('dashboard')
  const [modal, setModal] = useState(null) // null | 'add' | { carton }

  function handleSave(data) {
    if (modal === 'add') {
      addCarton(data)
    } else {
      updateCarton(modal.carton.id, data)
    }
    setModal(null)
  }

  const suggestedNumber = modal === 'add'
    ? nextNumber('B', cartons)
    : undefined

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-white">Déménagement</h1>
        <p className="text-slate-500 text-sm mt-0.5">{cartons.length} carton{cartons.length > 1 ? 's' : ''} enregistré{cartons.length > 1 ? 's' : ''}</p>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-28 overflow-y-auto">
        {tab === 'dashboard' && <Dashboard cartons={cartons} />}
        {tab === 'list' && (
          <CartonList
            cartons={cartons}
            onEdit={carton => setModal({ carton })}
            onDelete={deleteCarton}
            onCycleStatus={cycleStatus}
          />
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setModal('add')}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl flex items-center justify-center shadow-lg shadow-blue-900/50 active:scale-95 transition-transform z-40"
      >
        +
      </button>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-slate-900/95 backdrop-blur border-t border-slate-800 flex z-40">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              tab === t.id ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal === 'add' ? 'Nouveau carton' : `Modifier ${modal.carton.prefix}${modal.carton.number}`}
          onClose={() => setModal(null)}
        >
          <CartonForm
            initial={modal === 'add' ? null : modal.carton}
            suggestedNumber={suggestedNumber}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
