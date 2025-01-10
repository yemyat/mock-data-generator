"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NodeTypeSelector } from "./NodeTypeSelector";
import { JSONNode as JSONNodeType } from "../types/json";
import { Trash2 } from "lucide-react";

interface JSONNodeProps {
  node: JSONNodeType;
  onUpdate: (updatedNode: JSONNodeType) => void;
  onDelete: () => void;
  depth: number;
  isRoot?: boolean;
}

export const JSONNode = memo(function JSONNode({
  node,
  onUpdate,
  onDelete,
  depth,
  isRoot = false,
}: JSONNodeProps) {
  const handleKeyChange = (newKey: string) => {
    onUpdate({ ...node, key: newKey });
  };

  const handleTypeChange = (newType: string) => {
    onUpdate({
      ...node,
      type: newType as JSONNodeType["type"],
      value: null,
    });
  };

  const handleDescriptionChange = (newDescription: string) => {
    onUpdate({ ...node, description: newDescription });
  };

  return (
    <div
      className="border rounded-lg my-2 bg-white shadow-sm"
      style={{ marginLeft: `${depth * 12}px` }}
    >
      <div className="p-2 flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={node.key}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={isRoot ? "Root Key" : "Key"}
              className="w-[200px] h-8 text-sm"
            />
            <div className="flex items-center gap-2">
              <NodeTypeSelector value={node.type} onChange={handleTypeChange} />
            </div>
            {node.type !== "null" && (
              <Input
                value={node.description || ""}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe the data in this node. Use examples for better accuracy."
                className="w-full h-8 text-sm"
                required
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onDelete} variant="outline" size="sm">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
