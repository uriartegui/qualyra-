import { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rule } from "./types";

interface RulesSelectionModalProps {
  isOpen: boolean;
  rules: Rule[];
  selectedRuleIds: string[];
  onSave: (ruleIds: string[]) => void;
  onCancel: () => void;
}

export function RulesSelectionModal({
  isOpen,
  rules,
  selectedRuleIds,
  onSave,
  onCancel,
}: RulesSelectionModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelected(new Set(selectedRuleIds));
  }, [selectedRuleIds, isOpen]);

  // Group rules by topic
  const rulesByTopic = useMemo(() => {
    const grouped: Record<string, Rule[]> = {};
    rules.forEach((rule) => {
      if (!grouped[rule.topicName]) {
        grouped[rule.topicName] = [];
      }
      grouped[rule.topicName].push(rule);
    });
    return grouped;
  }, [rules]);

  const toggleRule = (ruleId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave(Array.from(selected));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Regras</DialogTitle>
          <DialogDescription>
            Escolha as regras que farão parte deste template
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
          {Object.keys(rulesByTopic).length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              Nenhuma regra disponível
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(rulesByTopic).map(([topicName, topicRules]) => (
                <div key={topicName}>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-3">
                    {topicName}
                  </h3>
                  <div className="space-y-2">
                    {topicRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        onClick={() => toggleRule(rule.id)}
                      >
                        <Checkbox
                          id={rule.id}
                          checked={selected.has(rule.id)}
                          onCheckedChange={() => toggleRule(rule.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={rule.id}
                            className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer block"
                          >
                            {rule.title}
                          </label>
                          {rule.expectedResult && (
                            <div className="flex items-start gap-1.5 mt-1">
                              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
                                {rule.expectedResult}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {selected.size} {selected.size === 1 ? "regra selecionada" : "regras selecionadas"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
