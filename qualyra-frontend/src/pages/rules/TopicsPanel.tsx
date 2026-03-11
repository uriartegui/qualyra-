import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, FileText, Plus, MoreVertical, Edit2, Trash2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Topic, Rule } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";

interface TopicsPanelProps {
  topics: Topic[];
  expandedTopicId: string | null;
  topicRules: Record<string, Rule[]>;
  selectedRuleId?: string;
  onTopicClick: (topicId: string) => void;
  onCreateTopic: (name: string) => void;
  onUpdateTopic: (id: string, name: string) => void;
  onDeleteTopic: (id: string) => void;
  onRuleClick: (rule: Rule) => void;
  onNewRule: (topicId: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function TopicsPanel({
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
  canEdit,
  canDelete,
}: TopicsPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = useState("");

  const handleCreateSubmit = () => {
    if (newTopicName.trim()) {
      onCreateTopic(newTopicName.trim());
      setNewTopicName("");
      setIsCreating(false);
    }
  };

  const handleEditSubmit = (topicId: string) => {
    if (editingTopicName.trim()) {
      onUpdateTopic(topicId, editingTopicName.trim());
      setEditingTopicId(null);
      setEditingTopicName("");
    }
  };

  const startEditing = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditingTopicName(topic.name);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-80 bg-white dark:bg-slate-900 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Tópicos</h2>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Create Topic Input */}
        {isCreating && (
          <div className="mt-2">
            <Input
              autoFocus
              placeholder="Nome do tópico"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateSubmit();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewTopicName("");
                }
              }}
              onBlur={handleCreateSubmit}
              className="h-9"
            />
          </div>
        )}
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto p-2">
        {topics.map((topic, topicIndex) => (
          <div key={topic.id} className="mb-1">
            {/* Topic Header */}
            <div
              className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                expandedTopicId === topic.id ? "bg-slate-50 dark:bg-slate-800" : ""
              }`}
            >
              {editingTopicId === topic.id ? (
                <Input
                  autoFocus
                  value={editingTopicName}
                  onChange={(e) => setEditingTopicName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSubmit(topic.id);
                    if (e.key === "Escape") {
                      setEditingTopicId(null);
                      setEditingTopicName("");
                    }
                  }}
                  onBlur={() => handleEditSubmit(topic.id)}
                  className="h-7 flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: expandedTopicId === topic.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  </motion.div>
                  {expandedTopicId === topic.id ? (
                    <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span
                    className="flex-1 text-sm text-slate-700 dark:text-slate-300"
                    onClick={() => onTopicClick(topic.id)}
                  >
                    <span className="text-slate-400 dark:text-slate-500 font-mono mr-1">{pad(topicIndex + 1)}</span>
                    {topic.name}
                  </span>
                  {(canEdit || canDelete) && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canEdit && (
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                onNewRule(topic.id);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Nova Regra
                            </DropdownMenuItem>
                          )}
                          {canEdit && (
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                startEditing(topic);
                              }}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Editar Tópico
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                onDeleteTopic(topic.id);
                              }}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir Tópico
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Rules List with Animation */}
            <AnimatePresence>
              {expandedTopicId === topic.id && topicRules[topic.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 mt-1 space-y-0.5">
                    {topicRules[topic.id].map((rule, ruleIndex) => (
                      <div
                        key={rule.id}
                        onClick={() => onRuleClick(rule)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                          selectedRuleId === rule.id
                            ? "bg-primary text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Circle className="w-1.5 h-1.5 fill-current flex-shrink-0" />
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-xs truncate">
                          <span className={`font-mono mr-1 ${selectedRuleId === rule.id ? "opacity-70" : "text-slate-400 dark:text-slate-500"}`}>
                            {pad(topicIndex + 1)}.{pad(ruleIndex + 1)}
                          </span>
                          {rule.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
