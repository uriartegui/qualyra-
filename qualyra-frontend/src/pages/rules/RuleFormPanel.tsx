import { useState, useEffect } from "react";
import { X, Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Rule } from "./types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface RuleFormPanelProps {
  rule: Rule | null;
  onSave: (rule: Omit<Rule, "id" | "topicId" | "topicName">) => void;
  onCancel: () => void;
}

interface StepItemProps {
  step: string;
  index: number;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
  updateStep: (index: number, value: string) => void;
  removeStep: (index: number) => void;
}

const StepItem = ({ step, index, moveStep, updateStep, removeStep }: StepItemProps) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "step",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "step",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveStep(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`flex items-center gap-2 ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div
        ref={drag}
        className="cursor-grab active:cursor-grabbing flex items-center justify-center w-6 h-6 rounded bg-slate-700 dark:bg-slate-600 text-white text-xs font-medium flex-shrink-0"
      >
        {index + 1}
      </div>
      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab flex-shrink-0" />
      <Input
        value={step}
        onChange={(e) => updateStep(index, e.target.value)}
        placeholder="Descreva o passo"
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => removeStep(index)}
        className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

function RuleFormContent({ rule, onSave, onCancel }: RuleFormPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [expectedResult, setExpectedResult] = useState("");
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (rule) {
      setTitle(rule.title);
      setDescription(rule.description);
      setSteps(rule.steps ? rule.steps.split("\n").filter((s) => s.trim()) : []);
      setExpectedResult(rule.expectedResult);
      setObservations(rule.observations || "");
    } else {
      setTitle("");
      setDescription("");
      setSteps([]);
      setExpectedResult("");
      setObservations("");
    }
  }, [rule]);

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const moveStep = (dragIndex: number, hoverIndex: number) => {
    const newSteps = [...steps];
    const draggedStep = newSteps[dragIndex];
    newSteps.splice(dragIndex, 1);
    newSteps.splice(hoverIndex, 0, draggedStep);
    setSteps(newSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      steps: steps.filter((s) => s.trim()).join("\n"),
      expectedResult: expectedResult.trim(),
      observations: observations.trim(),
    });
  };

  return (
    <div className="h-full bg-white dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {rule ? "Editar Regra" : "Nova Regra"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título da regra"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o objetivo desta regra"
            rows={3}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <Label>Passo a passo</Label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <StepItem
                key={index}
                step={step}
                index={index}
                moveStep={moveStep}
                updateStep={updateStep}
                removeStep={removeStep}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar novo passo
          </Button>
        </div>

        {/* Expected Result */}
        <div className="space-y-2">
          <Label htmlFor="expectedResult">Comportamento esperado</Label>
          <Textarea
            id="expectedResult"
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
            placeholder="Descreva o resultado esperado"
            rows={3}
          />
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <Label htmlFor="observations">Observações</Label>
          <Textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Adicione observações relevantes (opcional)"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Salvar
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

export function RuleFormPanel(props: RuleFormPanelProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <RuleFormContent {...props} />
    </DndProvider>
  );
}
