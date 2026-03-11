import { useState, useEffect } from 'react'
import { getRulesByTopic, createRule, updateRule, deleteRule } from '../../api/rules'
import { getTopics, createTopic, updateTopic, deleteTopic } from '../../api/topics'
import TopicsPanel from './TopicsPanel'
import RuleDetailPanel from './RuleDetailPanel'
import RuleFormPanel from './RuleFormPanel'

export default function RulesPage() {
  const [topics, setTopics] = useState([])
  const [topicRules, setTopicRules] = useState({})
  const [expandedTopicId, setExpandedTopicId] = useState(null)
  const [selectedRule, setSelectedRule] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [creatingRuleForTopic, setCreatingRuleForTopic] = useState(null)

  useEffect(() => { loadTopics() }, [])

  const loadTopics = async () => {
    const res = await getTopics({ size: 100 })
    setTopics(res.data.content)
  }

  const handleTopicClick = async (topicId) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null)
    } else {
      setExpandedTopicId(topicId)
      if (!topicRules[topicId]) {
        const res = await getRulesByTopic(topicId, { size: 100 })
        setTopicRules((prev) => ({ ...prev, [topicId]: res.data.content }))
      }
    }
  }

  const handleCreateTopic = async (name) => {
    await createTopic({ name })
    loadTopics()
  }

  const handleUpdateTopic = async (id, name) => {
    await updateTopic(id, { name })
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)))
  }

  const handleDeleteTopic = async (id) => {
    if (!confirm('Excluir este tópico? Todas as regras serão removidas.')) return
    await deleteTopic(id)
    setTopics((prev) => prev.filter((t) => t.id !== id))
    setTopicRules((prev) => { const next = { ...prev }; delete next[id]; return next })
    if (expandedTopicId === id) setExpandedTopicId(null)
    if (selectedRule?.topicId === id) setSelectedRule(null)
  }

  const handleRuleClick = (rule) => {
    setSelectedRule(rule)
    setIsFormOpen(false)
    setEditingRule(null)
  }

  const handleNewRule = (topicId) => {
    setCreatingRuleForTopic(topicId)
    setEditingRule(null)
    setSelectedRule(null)
    setIsFormOpen(true)
  }

  const handleEditRule = () => {
    if (selectedRule) {
      setEditingRule(selectedRule)
      setIsFormOpen(true)
    }
  }

  const handleDeleteRule = async () => {
    if (!selectedRule) return
    await deleteRule(selectedRule.id)
    setTopicRules((prev) => ({
      ...prev,
      [selectedRule.topicId]: (prev[selectedRule.topicId] || []).filter((r) => r.id !== selectedRule.id),
    }))
    setSelectedRule(null)
  }

  const handleSaveRule = async (ruleData) => {
    if (editingRule) {
      const res = await updateRule(editingRule.id, ruleData)
      const updated = res.data
      setTopicRules((prev) => ({
        ...prev,
        [editingRule.topicId]: (prev[editingRule.topicId] || []).map((r) =>
          r.id === updated.id ? updated : r
        ),
      }))
      setSelectedRule(updated)
    } else if (creatingRuleForTopic) {
      const res = await createRule(creatingRuleForTopic, ruleData)
      const newRule = res.data
      setTopicRules((prev) => ({
        ...prev,
        [creatingRuleForTopic]: [...(prev[creatingRuleForTopic] || []), newRule],
      }))
      setExpandedTopicId(creatingRuleForTopic)
      setSelectedRule(newRule)
    }
    setIsFormOpen(false)
    setEditingRule(null)
    setCreatingRuleForTopic(null)
  }

  const handleCancelForm = () => {
    setIsFormOpen(false)
    setEditingRule(null)
    setCreatingRuleForTopic(null)
  }

  return (
    <div className="flex h-full bg-slate-50">
      <TopicsPanel
        topics={topics}
        expandedTopicId={expandedTopicId}
        topicRules={topicRules}
        selectedRuleId={selectedRule?.id}
        onTopicClick={handleTopicClick}
        onCreateTopic={handleCreateTopic}
        onUpdateTopic={handleUpdateTopic}
        onDeleteTopic={handleDeleteTopic}
        onRuleClick={handleRuleClick}
        onNewRule={handleNewRule}
      />

      <div className="flex-1 overflow-y-auto">
        {isFormOpen ? (
          <RuleFormPanel
            rule={editingRule}
            onSave={handleSaveRule}
            onCancel={handleCancelForm}
          />
        ) : selectedRule ? (
          <RuleDetailPanel
            rule={selectedRule}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <p className="text-lg">Selecione uma regra para visualizar</p>
              <p className="text-sm mt-2">ou crie uma nova usando o menu do tópico</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
