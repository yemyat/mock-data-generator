import { useState, memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NodeTypeSelector } from "./NodeTypeSelector";
import { JSONNode as JSONNodeType } from "../types/json";
import { Trash2, Info, Plus } from "lucide-react";
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

export const JSONNode = memo(function JSONNode({
  node,
  onUpdate,
  onDelete,
  onAddChild,
  depth,
  isRoot = false,
  parentType,
  index,
}: JSONNodeProps) {
  const [isExpanded] = useState(true);
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

  const handleDescriptionChange = (newDescription: string) => {
    onUpdate({ ...node, description: newDescription });
  };

  const handleArrayCountChange = (newCount: number[]) => {
    setArrayCount(newCount[0]);
    onUpdate({ ...node });
  };

  const canHaveChildren = node.type === "object" || node.type === "array";
  const nodeLabel =
    parentType === "array" ? `Item ${index! + 1}` : node.key || "Root";

  return (
    <div
      className="border rounded-lg my-2 bg-white shadow-sm"
      style={{ marginLeft: `${depth * 12}px` }}
    >
      <div className="p-2 flex flex-col space-y-2">
        <div className="flex items-center gap-2">
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
            {node.type !== "null" && (
              <Input
                value={node.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe the data in this node. Use examples for better accuracy."
                className="w-full h-8 text-sm"
                required
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {canHaveChildren && (
              <Button
                onClick={onAddChild}
                variant="outline"
                size="sm"
                className="flex flex-row items-center justify-center"
              >
                <Plus size={16} />
                <span>Add {node.type === "array" ? "Entry" : "Key"}</span>
              </Button>
            )}
            <Button onClick={onDelete} variant="outline" size="sm">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        {node.type === "array" && (
          <div className="flex flex-col space-y-2 my-2">
            <label className="text-sm font-medium">
              Number of items to generate: {arrayCount}
            </label>
            <Slider
              value={[arrayCount]}
              onValueChange={handleArrayCountChange}
              max={25}
              min={1}
              step={1}
            />
          </div>
        )}
      </div>
      {isExpanded && canHaveChildren && (
        <div className="px-2">
          {node.type === "array" &&
            Array.isArray(node.value) &&
            node.value.length === 0 && (
              <div className="text-sm text-muted-foreground p-2 text-center border rounded-md flex flex-row space-x-2 items-center justify-center bg-background my-2">
                <Info size={16} />
                <span>
                  Empty array. Click &quot;Add Item&quot; to add array entries.
                </span>
              </div>
            )}
          {node.type === "object" &&
            typeof node.value === "object" &&
            node.value !== null &&
            Object.keys(node.value).length === 0 && (
              <div className="text-sm text-muted-foreground p-2 text-center border rounded-md">
                Empty object. Click &quot;Add Child Key&quot; to add properties.
              </div>
            )}
        </div>
      )}
    </div>
  );
});
