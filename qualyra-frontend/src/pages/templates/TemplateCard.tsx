import { Template } from "./types";
import { Button } from "@/components/ui/button";
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
import { Eye, Edit2, Trash2 } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onCardClick: (templateId: string) => void;
  onView: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function TemplateCard({
  template,
  isSelected,
  onCardClick,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: TemplateCardProps) {
  return (
    <div
      onClick={() => onCardClick(template.id)}
      className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer min-h-[240px] flex flex-col ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      {/* Content */}
      <div className="flex-1 mb-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {template.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
          {template.description}
        </p>
        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <p>Criado em: {formatDate(template.createdAt)}</p>
          <p>Última atualização: {formatDate(template.updatedAt)}</p>
        </div>
      </div>

      {/* Action Buttons - Only show when selected */}
      {isSelected && (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(template)}
            className="flex-1 gap-2"
          >
            <Eye className="h-3.5 w-3.5" />
            Ver
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
              className="flex-1 gap-2"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Button>
          )}
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir template?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O template "{template.name}"
                    será permanentemente excluído.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(template);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
}