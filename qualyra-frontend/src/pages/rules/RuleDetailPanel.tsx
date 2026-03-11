import { Edit2, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Rule } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RuleDetailPanelProps {
  rule: Rule;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function RuleDetailPanel({ rule, onEdit, onDelete, canEdit, canDelete }: RuleDetailPanelProps) {
  const steps = rule.steps ? rule.steps.split("\n").filter((s) => s.trim()) : [];

  return (
    <div className="h-full bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {rule.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{rule.topicName}</p>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a regra "{rule.title}"? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto" style={{ height: "calc(100% - 97px)" }}>
        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Descrição
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {rule.description || "Sem descrição"}
          </p>
        </div>

        <Separator />

        {/* Steps */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Passo a passo
          </h3>
          {steps.length > 0 ? (
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
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-500 italic">
              Nenhum passo cadastrado.
            </p>
          )}
        </div>

        <Separator />

        {/* Expected Result */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Comportamento esperado
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {rule.expectedResult || "Sem comportamento esperado definido"}
          </p>
        </div>

        {/* Observations */}
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
