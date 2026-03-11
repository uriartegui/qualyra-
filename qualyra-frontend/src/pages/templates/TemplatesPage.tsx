import { useState, useEffect } from "react";
import { TemplateCard } from "./TemplateCard";
import { TemplateDetailPanel } from "./TemplateDetailPanel";
import { TemplateFormPanel } from "./TemplateFormPanel";
import { Template, Rule } from "./types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate, setTemplateRules } from '@/api/templates'
import { getAllRules } from '@/api/rules'
import useAuthStore from '@/store/authStore'

const api = {
  async getTemplates() {
    const res = await getTemplates({ size: 100 })
    return res.data.content
  },
  async getTemplate(id: string) {
    const res = await getTemplate(id)
    return res.data
  },
  async createTemplate(data: { name: string; description: string }) {
    const res = await createTemplate(data)
    return res.data
  },
  async updateTemplate(id: string, data: { name: string; description: string }) {
    const res = await updateTemplate(id, data)
    return res.data
  },
  async deleteTemplate(id: string) {
    await deleteTemplate(id)
  },
  async updateTemplateRules(templateId: string, ruleIds: string[]) {
    await setTemplateRules(templateId, { ruleIds })
  },
  async getAllRules() {
    const res = await getAllRules()
    return res.data as Rule[]
  },
}

type ViewMode = 'grid' | 'detail' | 'form';

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [allRules, setAllRules] = useState<Rule[]>([]);

  const { user } = useAuthStore()
  const userRole = user?.role
  const canEdit = ['OWNER', 'ADMIN', 'EDITOR'].includes(userRole)
  const canDelete = ['OWNER', 'ADMIN'].includes(userRole)

  useEffect(() => {
    loadTemplates();
    loadAllRules();
  }, []);

  const loadTemplates = async () => {
    const data = await api.getTemplates();
    setTemplates(data);
  };

  const loadAllRules = async () => {
    const rules = await api.getAllRules();
    setAllRules(rules);
  };

  const handleCardClick = (templateId: string) => {
    setSelectedCardId((prev) => (prev === templateId ? null : templateId));
  };

  const handleView = async (template: Template) => {
    const [fullTemplate, rules] = await Promise.all([
      api.getTemplate(template.id),
      api.getAllRules(),
    ]);
    setAllRules(rules);
    setSelectedTemplate(fullTemplate);
    setViewMode('detail');
    setSelectedCardId(null);
  };

  const handleEdit = async (template: Template) => {
    const fullTemplate = await api.getTemplate(template.id);
    setEditingTemplate(fullTemplate);
    setViewMode('form');
    setSelectedCardId(null);
  };

  const handleDelete = async (template: Template) => {
    await api.deleteTemplate(template.id);
    setTemplates((prev) => prev.filter((t) => t.id !== template.id));
    setSelectedCardId(null);
  };

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setViewMode('form');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedTemplate(null);
    setEditingTemplate(null);
  };

  const handleSaveTemplate = async (data: { name: string; description: string }) => {
    if (editingTemplate) {
      await api.updateTemplate(editingTemplate.id, data);
      await loadTemplates();
      setViewMode('grid');
    } else {
      await api.createTemplate(data);
      await loadTemplates();
      setViewMode('grid');
    }
    setEditingTemplate(null);
  };

  const handleCancelForm = () => {
    handleBackToGrid();
    setEditingTemplate(null);
  };

  const handleSaveRules = async (ruleIds: string[]) => {
    if (!selectedTemplate) return;
    try {
      await api.updateTemplateRules(selectedTemplate.id, ruleIds);
      const updatedAt = new Date().toISOString();
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selectedTemplate.id
            ? { ...t, totalRules: ruleIds.length, updatedAt }
            : t
        )
      );
    } catch (err: any) {
      const status = err?.response?.status;
      // 401 = token expirado (interceptor já faz refresh automático)
      // 403 = sem permissão (VIEWER)
      if (status !== 401 && status !== 403) {
        console.error('Erro ao salvar regras do template:', err);
      }
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 z-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Templates
              </h1>
              {canEdit && (
                <Button onClick={handleNewTemplate} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Template
                </Button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedCardId === template.id}
                  onCardClick={handleCardClick}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail View */}
      {viewMode === 'detail' && selectedTemplate && (
        <TemplateDetailPanel
          template={selectedTemplate}
          allRules={allRules}
          onBack={handleBackToGrid}
          onSaveRules={handleSaveRules}
          canEdit={canEdit}
        />
      )}

      {/* Form View */}
      {viewMode === 'form' && (
        <TemplateFormPanel
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}
