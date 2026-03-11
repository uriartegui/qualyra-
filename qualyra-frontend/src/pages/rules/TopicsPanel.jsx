import { useState } from 'react'
import { ChevronRight, Folder, FolderOpen, FileText, Plus, MoreVertical, Edit2, Trash2, Circle } from 'lucide-react'

export default function TopicsPanel({
  topics,
  expandedTopicId,
  topicRules,
  selectedRuleId,
  onTopicClick,
  onCreateTopic,
  onUpdateTopic,
  onDeleteTopic,
  onRuleClick,
  onNewRule,
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')
  const [editingTopicId, setEditingTopicId] = useState(null)
  const [editingTopicName, setEditingTopicName] = useState('')
  const [menuOpen, setMenuOpen] = useState(null)

  const handleCreateSubmit = () => {
    if (newTopicName.trim()) {
      onCreateTopic(newTopicName.trim())
      setNewTopicName('')
      setIsCreating(false)
    }
  }

  const handleEditSubmit = (topicId) => {
    if (editingTopicName.trim()) {
      onUpdateTopic(topicId, editingTopicName.trim())
      setEditingTopicId(null)
      setEditingTopicName('')
    }
  }

  const startEditing = (topic) => {
    setEditingTopicId(topic.id)
    setEditingTopicName(topic.name)
    setMenuOpen(null)
  }

  return (
    <div className="w-80 bg-white flex flex-col h-full border-r border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg text-slate-900">Tópicos</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {isCreating && (
          <div className="mt-2">
            <input
              autoFocus
              placeholder="Nome do tópico"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSubmit()
                if (e.key === 'Escape') { setIsCreating(false); setNewTopicName('') }
              }}
              onBlur={handleCreateSubmit}
              className="h-9 w-full border border-slate-300 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2" onClick={() => setMenuOpen(null)}>
        {topics.map((topic) => (
          <div key={topic.id} className="mb-1">
            <div className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors ${
              expandedTopicId === topic.id ? 'bg-slate-50' : ''
            }`}>
              {editingTopicId === topic.id ? (
                <input
                  autoFocus
                  value={editingTopicName}
                  onChange={(e) => setEditingTopicName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSubmit(topic.id)
                    if (e.key === 'Escape') { setEditingTopicId(null); setEditingTopicName('') }
                  }}
                  onBlur={() => handleEditSubmit(topic.id)}
                  className="h-7 flex-1 border border-slate-300 rounded px-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span
                    className="flex items-center gap-2 flex-1 text-sm text-slate-700"
                    onClick={() => onTopicClick(topic.id)}
                  >
                    <ChevronRight
                      className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                        expandedTopicId === topic.id ? 'rotate-90' : ''
                      }`}
                    />
                    {expandedTopicId === topic.id
                      ? <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      : <Folder className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    }
                    {topic.name}
                  </span>

                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setMenuOpen(menuOpen === topic.id ? null : topic.id)}
                      className="h-6 w-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                    {menuOpen === topic.id && (
                      <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-md z-10 text-sm w-40">
                        <button
                          onClick={() => { onNewRule(topic.id); setMenuOpen(null) }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-slate-50 text-indigo-600"
                        >
                          <Plus className="w-4 h-4" /> Nova Regra
                        </button>
                        <button
                          onClick={() => startEditing(topic)}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <Edit2 className="w-4 h-4" /> Editar Tópico
                        </button>
                        <button
                          onClick={() => { onDeleteTopic(topic.id); setMenuOpen(null) }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-slate-50 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir Tópico
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className={`overflow-hidden transition-all duration-200 ${
              expandedTopicId === topic.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-6 mt-1 space-y-0.5">
                {(topicRules[topic.id] || []).map((rule) => (
                  <div
                    key={rule.id}
                    onClick={() => onRuleClick(rule)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                      selectedRuleId === rule.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Circle className="w-1.5 h-1.5 fill-current flex-shrink-0" />
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs truncate">{rule.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
