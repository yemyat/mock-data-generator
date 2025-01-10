"use client";

import { useState, useEffect } from "react";
import { JSONNode as JSONNodeComponent } from "./JSONNode";
import { JSONNode, JSONObject, JSONValue } from "../types/json";
import { Button } from "@/components/ui/button";
import { Info, PlusCircle } from "lucide-react";

interface JSONBuilderProps {
  onUpdate: (data: JSONObject) => void;
  initialData?: JSONObject;
}

export function JSONBuilder({ onUpdate, initialData }: JSONBuilderProps) {
  const [nodes, setNodes] = useState<JSONNode[]>([]);

  useEffect(() => {
    if (initialData) {
      const initialNodes = Object.entries(initialData).map(([key, value]) => ({
        key,
        value,
        type: getValueType(value),
        description: "",
      }));
      setNodes(initialNodes);
    }
  }, [initialData]);

  const getValueType = (value: JSONValue): JSONNode["type"] => {
    if (value === null) return "null";
    return typeof value as JSONNode["type"];
  };

  const nodesToJSON = (nodes: JSONNode[]): JSONObject => {
    return nodes.reduce((acc, node) => {
      if (node.key) {
        acc[node.key] = node.value;
      }
      return acc;
    }, {} as JSONObject);
  };

  useEffect(() => {
    const jsonData = nodesToJSON(nodes);
    onUpdate(jsonData);
  }, [nodes, onUpdate]);

  const addRootNode = () => {
    const newNode: JSONNode = {
      key: "",
      value: null,
      type: "null",
      description: "",
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (index: number, updatedNode: JSONNode) => {
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      updatedNodes[index] = updatedNode;
      return updatedNodes;
    });
  };

  const deleteNode = (index: number) => {
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      updatedNodes.splice(index, 1);
      return updatedNodes;
    });
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Structure your JSON visually</h2>
        <div className="space-x-2">
          <Button
            onClick={addRootNode}
            size="sm"
            className="flex flex-row space-x-2"
          >
            <PlusCircle size={16} />
            Add Field
          </Button>
        </div>
      </div>
      {nodes.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border rounded-lg flex flex-col items-center justify-center">
          <div className="flex flex-row space-x-2 items-center">
            <Info size={16} />
            <span>
              Click &quot;Add Field&quot; to start building your JSON structure
            </span>
          </div>
        </div>
      ) : (
        nodes.map((node, index) => (
          <JSONNodeComponent
            key={index}
            node={node}
            onUpdate={(updatedNode) => updateNode(index, updatedNode)}
            onDelete={() => deleteNode(index)}
            depth={0}
            isRoot={true}
          />
        ))
      )}
    </div>
  );
}
