import { useState, useEffect } from 'react'
import { X, Plus, GripVertical, Trash2 } from 'lucide-react'

export default function RuleFormPanel({ rule, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState([])
  const [expectedResult, setExpectedResult] = useState('')
  const [observations, setObservations] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (rule) {
      setTitle(rule.title || '')
      setDescription(rule.description || '')
      setSteps(rule.steps ? rule.steps.split('\n').filter((s) => s.trim()) : [])
      setExpectedResult(rule.expectedResult || '')
      setObservations(rule.observations || '')
    } else {
      setTitle('')
      setDescription('')
      setSteps([])
      setExpectedResult('')
      setObservations('')
    }
  }, [rule])

  const addStep = () => setSteps([...steps, ''])

  const updateStep = (index, value) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      description: description.trim(),
      steps: steps.filter((s) => s.trim()).join('\n'),
      expectedResult: expectedResult.trim(),
      observations: observations.trim(),
    })
    setSaving(false)
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          {rule ? 'Editar Regra' : 'Nova Regra'}
        </h2>
        <button
          onClick={onCancel}
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título da regra"
            required
            className="w-full h-9 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o objetivo desta regra"
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Passo a passo</label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="cursor-grab flex items-center justify-center w-6 h-6 rounded bg-slate-700 text-white text-xs font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder="Descreva o passo"
                  className="flex-1 h-9 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="h-9 w-9 flex items-center justify-center rounded text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
          >
            <Plus className="w-4 h-4" />
            Adicionar novo passo
          </button>
        </div>

        {/* Expected Result */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Comportamento esperado</label>
          <textarea
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
            placeholder="Descreva o resultado esperado"
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Observações</label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Adicione observações relevantes (opcional)"
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="flex-1 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-50 text-slate-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
