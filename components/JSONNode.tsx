import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NodeTypeSelector } from "./NodeTypeSelector";
import { JSONNode as JSONNodeType } from "../types/json";
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface JSONNodeProps {
  node: JSONNodeType;
  onUpdate: (updatedNode: JSONNodeType) => void;
  onDelete: () => void;
  onAddChild: () => void;
  depth: number;
  isRoot?: boolean;
  parentType?: string;
  index?: number;
}

export function JSONNode({
  node,
  onUpdate,
  onDelete,
  onAddChild,
  depth,
  isRoot = false,
  parentType,
  index,
}: JSONNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [arrayCount, setArrayCount] = useState(1);

  const handleKeyChange = (newKey: string) => {
    onUpdate({ ...node, key: newKey || null });
  };

  const handleTypeChange = (newType: string) => {
    onUpdate({
      ...node,
      type: newType as JSONNodeType["type"],
      value: newType === "object" ? {} : newType === "array" ? [] : null,
    });
  };

  const handleValueChange = (newValue: string) => {
    let parsedValue: any = newValue;
    if (node.type === "number") {
      parsedValue = Number(newValue) || 0;
    } else if (node.type === "boolean") {
      parsedValue = newValue === "true";
    }
    onUpdate({ ...node, value: parsedValue });
  };

  const handleDescriptionChange = (newDescription: string) => {
    onUpdate({ ...node, description: newDescription });
  };

  const handleArrayCountChange = (newCount: number[]) => {
    setArrayCount(newCount[0]);
    onUpdate({ ...node, arrayCount: newCount[0] });
  };

  const canHaveChildren = node.type === "object" || node.type === "array";
  const showValue = !canHaveChildren && node.type !== "null";
  const nodeLabel =
    parentType === "array" ? `Item ${index! + 1}` : node.key || "Root";

  return (
    <div
      className="border rounded-lg my-2 bg-background shadow-sm"
      style={{ marginLeft: `${depth * 12}px` }}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          {canHaveChildren && (
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={node.key || ""}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={
                isRoot
                  ? "Root Key (optional)"
                  : parentType === "array"
                  ? nodeLabel
                  : "Key"
              }
              className="w-[200px] h-8 text-sm"
              disabled={isRoot && node.key === null}
            />
            <div className="flex items-center gap-2">
              <NodeTypeSelector value={node.type} onChange={handleTypeChange} />
            </div>
            {showValue && (
              <div className="flex-1">
                {node.type === "string" ? (
                  <Textarea
                    value={(node.value as string) || ""}
                    onChange={(e) => handleValueChange(e.target.value)}
                    placeholder="Value"
                    className="min-h-[60px] text-sm"
                  />
                ) : (
                  <Input
                    value={String(node.value || "")}
                    onChange={(e) => handleValueChange(e.target.value)}
                    placeholder="Value"
                    className="h-8 text-sm"
                    type={node.type === "number" ? "number" : "text"}
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canHaveChildren && (
              <Button
                onClick={onAddChild}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add {node.type === "array" ? "Item" : "Field"}
              </Button>
            )}
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {node.type !== "null" && (
          <Input
            value={node.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Description (optional)"
            className="w-full h-8 text-sm"
          />
        )}
        {node.type === "array" && (
          <div className="mt-2">
            <label className="text-sm font-medium">
              Number of items to generate: {arrayCount}
            </label>
            <Slider
              value={[arrayCount]}
              onValueChange={handleArrayCountChange}
              max={25}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        )}
      </div>
      {isExpanded && canHaveChildren && (
        <div className="px-3 pb-3">
          {node.type === "array" &&
            Array.isArray(node.value) &&
            node.value.length === 0 && (
              <div className="text-sm text-muted-foreground p-2 text-center border rounded-md">
                Empty array. Click "Add Item" to add items.
              </div>
            )}
          {node.type === "object" &&
            typeof node.value === "object" &&
            Object.keys(node.value).length === 0 && (
              <div className="text-sm text-muted-foreground p-2 text-center border rounded-md">
                Empty object. Click "Add Field" to add properties.
              </div>
            )}
        </div>
      )}
    </div>
  );
}
