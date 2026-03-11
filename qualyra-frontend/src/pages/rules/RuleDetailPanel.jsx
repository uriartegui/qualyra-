import { Edit2, Trash2, FileText } from 'lucide-react'

export default function RuleDetailPanel({ rule, onEdit, onDelete }) {
  const steps = rule.steps ? rule.steps.split('\n').filter((s) => s.trim()) : []

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir "${rule.title}"? Esta ação não pode ser desfeita.`)) {
      onDelete()
    }
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{rule.title}</h1>
            <p className="text-sm text-slate-500">{rule.topicName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-red-200 rounded-lg hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Descrição</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {rule.description || 'Sem descrição'}
          </p>
        </div>

        <hr className="border-slate-200" />

        {/* Steps */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Passo a passo</h3>
          {steps.length > 0 ? (
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">{index + 1}-</span> {step}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">Nenhum passo cadastrado.</p>
          )}
        </div>

        <hr className="border-slate-200" />

        {/* Expected Result */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Comportamento esperado</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {rule.expectedResult || 'Sem comportamento esperado definido'}
          </p>
        </div>

        {/* Observations */}
        {rule.observations && (
          <>
            <hr className="border-slate-200" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Observações</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {rule.observations}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
