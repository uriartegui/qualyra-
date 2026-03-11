import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Template, Rule } from "./types";
import { motion, AnimatePresence } from "motion/react";

interface TemplateDetailPanelProps {
  template: Template;
  allRules: Rule[];
  onBack: () => void;
  onSaveRules: (ruleIds: string[]) => void;
  canEdit: boolean;
}

interface TopicGroup {
  topicId: string;
  topicName: string;
  rules: Rule[];
}

// Painel de detalhe da regra — leitura apenas, mesmo visual do RuleDetailPanel
function RuleReadOnlyPanel({ rule }: { rule: Rule }) {
  const steps = rule.steps ? rule.steps.split("\n").filter((s) => s.trim()) : [];

  return (
    <div className="h-full bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          {rule.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{rule.topicName}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Descrição */}
        {rule.description && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Descrição
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {rule.description}
            </p>
          </div>
        )}

        {rule.description && (steps.length > 0 || rule.expectedResult) && <Separator />}

        {/* Passo a passo */}
        {steps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Passo a passo
            </h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {index + 1}-
                    </span>{" "}
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {steps.length > 0 && rule.expectedResult && <Separator />}

        {/* Comportamento esperado */}
        {rule.expectedResult && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Comportamento esperado
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {rule.expectedResult}
            </p>
          </div>
        )}

        {/* Observações */}
        {rule.observations && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Observações
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {rule.observations}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function TemplateDetailPanel({
  template,
  allRules,
  onBack,
  onSaveRules,
  canEdit,
}: TemplateDetailPanelProps) {
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<string>>(new Set());
  const [viewingRuleId, setViewingRuleId] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Inicializa regras selecionadas filtrando apenas as ativas (presentes em allRules)
  useEffect(() => {
    const activeIds = new Set(allRules.map((r) => r.id));
    const templateRuleIds = template.rules?.map((r) => r.id) || [];
    const activeTemplateIds = templateRuleIds.filter((id) => activeIds.has(id));
    setSelectedRuleIds(new Set(activeTemplateIds));

    // Se regras foram deletadas, sincroniza com o backend (só se allRules já carregou e o usuário pode editar)
    if (canEdit && allRules.length > 0 && activeTemplateIds.length !== templateRuleIds.length) {
      onSaveRules(activeTemplateIds);
    }
  }, [template.id, allRules, canEdit]);

  // Agrupa regras por tópico
  const topicGroups: TopicGroup[] = allRules.reduce((acc, rule) => {
    const existing = acc.find((g) => g.topicId === rule.topicId);
    if (existing) {
      existing.rules.push(rule);
    } else {
      acc.push({ topicId: rule.topicId, topicName: rule.topicName, rules: [rule] });
    }
    return acc;
  }, [] as TopicGroup[]);

  // Expande todos os tópicos por padrão
  useEffect(() => {
    setExpandedTopics(new Set(topicGroups.map((g) => g.topicId)));
  }, [topicGroups.length]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      next.has(topicId) ? next.delete(topicId) : next.add(topicId);
      return next;
    });
  };

  const toggleRule = (ruleId: string) => {
    if (!canEdit) return;
    const next = new Set(selectedRuleIds);
    next.has(ruleId) ? next.delete(ruleId) : next.add(ruleId);
    setSelectedRuleIds(next);
    onSaveRules(Array.from(next));
  };

  const viewingRule = viewingRuleId ? allRules.find((r) => r.id === viewingRuleId) : null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Painel esquerdo — Tópicos e Regras */}
      <div className="w-80 bg-white dark:bg-slate-900 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate">
              {template.name}
            </h2>
          </div>
          {template.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-10 truncate">
              {template.description}
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500 ml-10 mt-1">
            {selectedRuleIds.size}{" "}
            {selectedRuleIds.size === 1 ? "regra selecionada" : "regras selecionadas"}
          </p>
        </div>

        {/* Lista de tópicos */}
        <div className="flex-1 overflow-y-auto p-2">
          {topicGroups.map((topic, topicIndex) => {
            const isExpanded = expandedTopics.has(topic.topicId);
            const selectedInTopic = topic.rules.filter((r) =>
              selectedRuleIds.has(r.id)
            ).length;

            return (
              <div key={topic.topicId} className="mb-1">
                {/* Cabeçalho do tópico */}
                <div
                  className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    isExpanded ? "bg-slate-50 dark:bg-slate-800" : ""
                  }`}
                  onClick={() => toggleTopic(topic.topicId)}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  </motion.div>
                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">
                    <span className="text-slate-400 dark:text-slate-500 font-mono mr-1">{pad(topicIndex + 1)}</span>
                    {topic.topicName}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {selectedInTopic}/{topic.rules.length}
                  </span>
                </div>

                {/* Lista de regras com animação */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-1 space-y-0.5">
                        {topic.rules.map((rule, ruleIndex) => {
                          const isSelected = selectedRuleIds.has(rule.id);
                          const isViewing = viewingRuleId === rule.id;

                          return (
                            <div
                              key={rule.id}
                              onClick={() => setViewingRuleId(rule.id)}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                                isViewing
                                  ? "bg-slate-100 dark:bg-slate-800"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <Circle
                                className={`w-1.5 h-1.5 fill-current flex-shrink-0 ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-slate-300 dark:text-slate-600"
                                }`}
                              />
                              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                              <span className="text-xs flex-1 truncate text-slate-700 dark:text-slate-300">
                                <span className="font-mono mr-1 text-slate-400 dark:text-slate-500">
                                  {pad(topicIndex + 1)}.{pad(ruleIndex + 1)}
                                </span>
                                {rule.title}
                              </span>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRule(rule.id);
                                }}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  disabled={!canEdit}
                                  className="h-3.5 w-3.5"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {topicGroups.length === 0 && (
            <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-500">
              <p className="text-sm">Nenhuma regra disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Painel direito — Detalhe da regra */}
      <div className="flex-1 overflow-y-auto border-l border-slate-200 dark:border-slate-800">
        {viewingRule ? (
          <RuleReadOnlyPanel rule={viewingRule} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <p className="text-lg">Selecione uma regra para visualizar</p>
              <p className="text-sm mt-2">
                Use os checkboxes para incluir ou remover regras do template
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
