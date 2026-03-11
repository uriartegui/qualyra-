import { useState, useEffect } from "react";
import { TopicsPanel } from "./TopicsPanel";
import { RuleDetailPanel } from "./RuleDetailPanel";
import { RuleFormPanel } from "./RuleFormPanel";
import { Topic, Rule } from "./types";
import useAuthStore from "@/store/authStore";

import { getRulesByTopic, createRule, updateRule, deleteRule } from '@/api/rules'
import { getTopics, createTopic, updateTopic, deleteTopic } from '@/api/topics'

const api = {
  async getTopics() {
    const res = await getTopics({ size: 100 })
    return res.data.content
  },
  async createTopic(name: string) {
    const res = await createTopic({ name })
    return res.data
  },
  async updateTopic(id: string, name: string) {
    const res = await updateTopic(id, { name })
    return res.data
  },
  async deleteTopic(id: string) {
    await deleteTopic(id)
  },
  async getTopicRules(topicId: string) {
    const res = await getRulesByTopic(topicId, { size: 100 })
    return res.data.content
  },
  async createRule(topicId: string, rule: any) {
    const res = await createRule(topicId, rule)
    return res.data
  },
  async updateRule(id: string, rule: any) {
    const res = await updateRule(id, rule)
    return res.data
  },
  async deleteRule(id: string) {
    await deleteRule(id)
  },
}


export function RulesPage() {
  const { user } = useAuthStore();
  const canEdit = ['OWNER', 'ADMIN', 'EDITOR'].includes(user?.role);
  const canDelete = ['OWNER', 'ADMIN'].includes(user?.role);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [topicRules, setTopicRules] = useState<Record<string, Rule[]>>({});
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [creatingRuleForTopic, setCreatingRuleForTopic] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const data = await api.getTopics();
    setTopics(data);
  };

  const handleTopicClick = async (topicId: string) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null);
    } else {
      setExpandedTopicId(topicId);
      if (!topicRules[topicId]) {
        const rules = await api.getTopicRules(topicId);
        setTopicRules((prev) => ({ ...prev, [topicId]: rules }));
      }
    }
  };

  const handleCreateTopic = async (name: string) => {
    const newTopic = await api.createTopic(name);
    setTopics((prev) => [...prev, newTopic]);
  };

  const handleUpdateTopic = async (id: string, name: string) => {
    await api.updateTopic(id, name);
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const handleDeleteTopic = async (id: string) => {
    await api.deleteTopic(id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
    if (expandedTopicId === id) {
      setExpandedTopicId(null);
    }
    if (selectedRule?.topicId === id) {
      setSelectedRule(null);
    }
  };

  const handleRuleClick = (rule: Rule) => {
    setSelectedRule(rule);
    setIsFormOpen(false);
    setEditingRule(null);
  };

  const handleNewRule = (topicId: string) => {
    setCreatingRuleForTopic(topicId);
    setIsFormOpen(true);
    setEditingRule(null);
    setSelectedRule(null);
  };

  const handleEditRule = () => {
    if (selectedRule) {
      setEditingRule(selectedRule);
      setIsFormOpen(true);
    }
  };

  const handleDeleteRule = async () => {
    if (selectedRule) {
      await api.deleteRule(selectedRule.id);
      setTopicRules((prev) => ({
        ...prev,
        [selectedRule.topicId]: prev[selectedRule.topicId].filter((r) => r.id !== selectedRule.id),
      }));
      setSelectedRule(null);
    }
  };

  const handleSaveRule = async (ruleData: Omit<Rule, "id" | "topicId" | "topicName">) => {
    if (editingRule) {
      // Update existing rule
      const updated = await api.updateRule(editingRule.id, { ...editingRule, ...ruleData });
      setTopicRules((prev) => ({
        ...prev,
        [updated.topicId]: prev[updated.topicId].map((r) => (r.id === updated.id ? updated : r)),
      }));
      setSelectedRule(updated);
    } else if (creatingRuleForTopic) {
      // Create new rule
      const newRule = await api.createRule(creatingRuleForTopic, ruleData);
      const topic = topics.find((t) => t.id === creatingRuleForTopic);
      const ruleWithTopic = { ...newRule, topicName: topic?.name || "" };

      setTopicRules((prev) => ({
        ...prev,
        [creatingRuleForTopic]: [...(prev[creatingRuleForTopic] || []), ruleWithTopic],
      }));

      setExpandedTopicId(creatingRuleForTopic);
      setSelectedRule(ruleWithTopic);
    }

    setIsFormOpen(false);
    setEditingRule(null);
    setCreatingRuleForTopic(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingRule(null);
    setCreatingRuleForTopic(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Left Panel - Topics */}
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
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {/* Right Panel - Rule Detail or Form */}
      <div className="flex-1 overflow-y-auto border-l border-slate-200 dark:border-slate-800">
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
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <p className="text-lg">Selecione uma regra para visualizar</p>
              <p className="text-sm mt-2">ou crie uma nova usando o menu do tópico</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
