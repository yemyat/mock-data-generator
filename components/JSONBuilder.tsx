import { useState, useEffect } from "react";
import { JSONNode as JSONNodeComponent } from "./JSONNode";
import { JSONNode, JSONObject, JSONArray, JSONValue } from "../types/json";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wand2 } from "lucide-react";
import { generateSyntheticData } from "../utils/dataGenerator";

interface JSONBuilderProps {
  onUpdate: (data: JSONValue) => void;
  initialData?: JSONValue;
}

export function JSONBuilder({ onUpdate, initialData }: JSONBuilderProps) {
  const [nodes, setNodes] = useState<JSONNode[]>([]);

  useEffect(() => {
    if (initialData) {
      const initialNodes = Object.entries(initialData as JSONObject).map(
        ([key, value]) => ({
          key,
          value: convertToNodeValue(value),
          type: getValueType(value),
          description: "",
        })
      );
      setNodes(initialNodes);
    }
  }, [initialData]);

  const getValueType = (value: any): JSONNode["type"] => {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    if (typeof value === "object") return "object";
    return typeof value as JSONNode["type"];
  };

  const convertToNodeValue = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map((item) => ({
        key: null,
        value: convertToNodeValue(item),
        type: getValueType(item),
        description: "",
      }));
    }
    if (value && typeof value === "object") {
      return Object.entries(value).reduce((acc, [key, val]) => {
        acc[key] = {
          key,
          value: convertToNodeValue(val),
          type: getValueType(val),
          description: "",
        };
        return acc;
      }, {} as JSONObject);
    }
    return value;
  };

  useEffect(() => {
    const jsonData = nodesToJSON(nodes);
    onUpdate(jsonData);
  }, [nodes, onUpdate]);

  const nodesToJSON = (nodes: JSONNode[]): JSONValue => {
    return nodes.reduce((acc, node) => {
      if (node.key) {
        acc[node.key] = nodeToJSON(node);
      }
      return acc;
    }, {} as JSONObject);
  };

  const nodeToJSON = (node: JSONNode): JSONValue => {
    if (node.type === "object") {
      return Object.entries(node.value as JSONObject).reduce(
        (acc, [key, value]) => {
          const childNode = value as JSONNode;
          acc[key] = nodeToJSON(childNode);
          return acc;
        },
        {} as JSONObject
      );
    } else if (node.type === "array") {
      return (node.value as JSONArray).map((item) =>
        typeof item === "object" ? nodeToJSON(item as JSONNode) : item
      );
    } else {
      return node.value;
    }
  };

  const addRootNode = () => {
    const newNode: JSONNode = {
      key: "",
      value: null,
      type: "null",
      description: "",
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (path: number[], updatedNode: JSONNode) => {
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];

      if (path.length === 1) {
        // Updating a root node
        updatedNodes[path[0]] = updatedNode;
        return updatedNodes;
      }

      let currentNode = updatedNodes[path[0]];
      for (let i = 1; i < path.length - 1; i++) {
        if (currentNode.type === "object") {
          currentNode = Object.values(currentNode.value as JSONObject)[
            path[i]
          ] as JSONNode;
        } else if (currentNode.type === "array") {
          currentNode = (currentNode.value as JSONArray)[path[i]] as JSONNode;
        }
      }

      if (currentNode.type === "object") {
        const objectValue = currentNode.value as JSONObject;
        const oldKey = Object.keys(objectValue)[path[path.length - 1]];
        if (oldKey !== updatedNode.key && updatedNode.key) {
          const newValue = { ...objectValue };
          delete newValue[oldKey];
          newValue[updatedNode.key] = updatedNode;
          currentNode.value = newValue;
        } else {
          objectValue[oldKey] = updatedNode;
        }
      } else if (currentNode.type === "array") {
        (currentNode.value as JSONArray)[path[path.length - 1]] = updatedNode;
      }

      return updatedNodes;
    });
  };

  const deleteNode = (path: number[]) => {
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];

      if (path.length === 1) {
        // Deleting a root node
        updatedNodes.splice(path[0], 1);
        return updatedNodes;
      }

      let currentNode = updatedNodes[path[0]];
      for (let i = 1; i < path.length - 1; i++) {
        if (currentNode.type === "object") {
          currentNode = Object.values(currentNode.value as JSONObject)[
            path[i]
          ] as JSONNode;
        } else if (currentNode.type === "array") {
          currentNode = (currentNode.value as JSONArray)[path[i]] as JSONNode;
        }
      }

      if (currentNode.type === "object") {
        const objectValue = currentNode.value as JSONObject;
        const keyToDelete = Object.keys(objectValue)[path[path.length - 1]];
        delete objectValue[keyToDelete];
      } else if (currentNode.type === "array") {
        (currentNode.value as JSONArray).splice(path[path.length - 1], 1);
      }

      return updatedNodes;
    });
  };

  const addChildNode = (parentIndex: number[]) => {
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      const newNode: JSONNode = {
        key: "",
        value: null,
        type: "string",
        description: "",
      };

      let currentNode = updatedNodes[parentIndex[0]];
      for (let i = 1; i < parentIndex.length; i++) {
        if (currentNode.type === "object") {
          currentNode = Object.values(currentNode.value as JSONObject)[
            parentIndex[i]
          ] as JSONNode;
        } else if (currentNode.type === "array") {
          currentNode = (currentNode.value as JSONArray)[
            parentIndex[i]
          ] as JSONNode;
        }
      }

      if (currentNode.type === "object") {
        const tempKey = `field_${
          Object.keys(currentNode.value as JSONObject).length
        }`;
        const updatedValue = {
          ...(currentNode.value as JSONObject),
          [tempKey]: { ...newNode, key: tempKey },
        };
        currentNode.value = updatedValue;
      } else if (currentNode.type === "array") {
        (currentNode.value as JSONArray).push(newNode);
      }

      return updatedNodes;
    });
  };

  const generateData = () => {
    const jsonData = nodesToJSON(nodes);
    console.log("JSON data before generation:", jsonData);
    const generatedData = generateSyntheticData({
      type: "object",
      value: jsonData,
      key: null,
      description: "",
      arrayCount: undefined,
    });
    console.log("Generated data:", generatedData);
    if (generatedData !== null) {
      onUpdate(generatedData);
    } else {
      console.error("Failed to generate data");
    }
  };

  const renderNode = (node: JSONNode, index: number[], depth: number) => {
    return (
      <JSONNodeComponent
        key={index.join("-")}
        node={node}
        onUpdate={(updatedNode) => updateNode(index, updatedNode)}
        onDelete={() => deleteNode(index)}
        onAddChild={() => addChildNode(index)}
        depth={depth}
        isRoot={depth === 0}
      />
    );
  };

  const renderTree = (nodes: JSONNode[], parentIndex: number[] = []) => {
    return nodes.map((node, i) => {
      const currentIndex = [...parentIndex, i];
      return (
        <div key={currentIndex.join("-")}>
          {renderNode(node, currentIndex, parentIndex.length)}
          {(node.type === "object" || node.type === "array") && node.value && (
            <div className="ml-4">
              {node.type === "object" &&
                renderTree(
                  Object.values(node.value as JSONObject),
                  currentIndex
                )}
              {node.type === "array" &&
                renderTree(node.value as JSONArray, currentIndex)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Structure your JSON visually</h2>
        <div className="space-x-2">
          <Button onClick={addRootNode} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Root Key
          </Button>
          <Button onClick={generateData} size="sm" variant="secondary">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Data
          </Button>
        </div>
      </div>
      {nodes.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border rounded-lg">
          Click &quot;Add Root Key&quot; to start building your JSON structure
        </div>
      ) : (
        renderTree(nodes)
      )}
    </div>
  );
}
