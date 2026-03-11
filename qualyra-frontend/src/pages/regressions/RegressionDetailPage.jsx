import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRegression, executeItem, completeRegression } from '../../api/regressions'
import { FileText, Pencil, Trash2, Flag, Check, X, ClipboardList, ArrowLeft } from 'lucide-react'

export default function RegressionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [regression, setRegression] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [id])

  const load = async () => {
    const res = await getRegression(id)
    setRegression(res.data)
    if (!selectedItem && res.data.items?.length > 0) {
      setSelectedItem(res.data.items[0])
    }
  }

  const handleExecute = async (result) => {
    if (!selectedItem || loading) return
    setLoading(true)
    try {
      await executeItem(id, selectedItem.id, { result, notes: '' })
      const res = await getRegression(id)
      setRegression(res.data)
      const updated = res.data.items.find(i => i.id === selectedItem.id)
      setSelectedItem(updated)
    } finally { setLoading(false) }
  }

  const handleComplete = async () => {
    if (!confirm('Concluir esta regressão?')) return
    setLoading(true)
    try {
      await completeRegression(id)
      load()
    } finally { setLoading(false) }
  }

  if (!regression) return <div className="p-8 text-gray-400">Carregando...</div>

  const completed = regression.status === 'COMPLETED'
  const progress = regression.totalRules > 0
    ? Math.round(((regression.passed + regression.failed) / regression.totalRules) * 100)
    : 0

  return (
    <div className="flex flex-col p-8 h-full gap-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/regressions')}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{regression.name}</h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            <Pencil size={14} /> Editar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-lg hover:bg-red-50 text-red-500">
            <Trash2 size={14} /> Excluir
          </button>
          {!completed && (
            <button
              onClick={handleComplete}
              disabled={loading || regression.pending > 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40"
            >
              <Flag size={14} /> Concluir Regressão
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: regression.totalRules, color: 'text-gray-900' },
          { label: 'Pass',     value: regression.passed,     color: 'text-green-600' },
          { label: 'Fail',     value: regression.failed,     color: 'text-red-500' },
          { label: 'Pendente', value: regression.pending,    color: 'text-yellow-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* BODY */}
      <div className="flex gap-6 flex-1 min-h-0">

        {/* PAINEL ESQUERDO — lista de testes */}
        <div className="w-72 bg-white rounded-xl border border-gray-200 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Testes</h2>
              <span className="text-xs text-gray-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="overflow-auto flex-1">
            {regression.items.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer text-sm border-b border-gray-100 last:border-0 ${
                  selectedItem?.id === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{item.ruleTitle}</span>
                {item.result === 'PASS' && <span className="text-xs font-medium text-green-600">Pass</span>}
                {item.result === 'FAIL' && <span className="text-xs font-medium text-red-500">Fail</span>}
                {!item.result && <span className="text-xs text-gray-300">Pendente</span>}
              </div>
            ))}
          </div>
        </div>

        {/* PAINEL DIREITO — detalhe da regra */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 overflow-auto">
          {!selectedItem ? (
            <div className="text-gray-400">Selecione um teste</div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{selectedItem.ruleTitle}</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Pencil size={14} /> Editar
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </div>

              {selectedItem.ruleDescription && (
                <section className="mb-6">
                  <h3 className="font-medium border-b mb-3 pb-1">Descrição</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{selectedItem.ruleDescription}</p>
                </section>
              )}

              {selectedItem.ruleSteps && (
                <section className="mb-6">
                  <h3 className="font-medium border-b mb-3 pb-1">Passo a passo</h3>
                  <div className="flex flex-col gap-2">
                    {selectedItem.ruleSteps.split('\n').filter(Boolean).map((step, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2.5"
                      >
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <FileText size={14} className="text-gray-400 shrink-0" />
                          {i + 1}- {step}
                        </div>

                        {!completed && !selectedItem.result && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <button
                              onClick={() => handleExecute('PASS')}
                              disabled={loading}
                              className="hover:text-green-500 disabled:opacity-50"
                              title="Passar"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={() => handleExecute('FAIL')}
                              disabled={loading}
                              className="hover:text-red-500 disabled:opacity-50"
                              title="Falhar"
                            >
                              <X size={15} />
                            </button>
                            <ClipboardList size={14} className="cursor-pointer hover:text-indigo-500" />
                          </div>
                        )}

                        {selectedItem.result && (
                          <span className={`text-xs font-medium ${
                            selectedItem.result === 'PASS' ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {selectedItem.result}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {selectedItem.ruleExpectedResult && (
                <section className="mb-6">
                  <h3 className="font-medium border-b mb-3 pb-1">Comportamento esperado</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{selectedItem.ruleExpectedResult}</p>
                </section>
              )}

              {selectedItem.notes && (
                <section className="mb-6">
                  <h3 className="font-medium border-b mb-3 pb-1">Observações do teste</h3>
                  <p className="text-sm text-gray-500 italic">"{selectedItem.notes}"</p>
                </section>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}
