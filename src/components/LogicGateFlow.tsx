import { useEffect, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import LogicGateNode from "./LogicGateNode";
import InputNode from "./InputNode";

type LogicGateNodeData = {
  label: string;
  inputs: number[];
  output: number;
};

type InputNodeData = {
  label: string;
  value: number;
  onValueChange: (id: string, value: number) => void;
};

type LogicGateNodeType = Node<LogicGateNodeData | InputNodeData>;

type LogicGateEdgeType = Edge;

const nodeTypes = {
  logicGate: LogicGateNode,
  inputNode: InputNode,
};

const initialNodes: LogicGateNodeType[] = [];
const initialEdges: LogicGateEdgeType[] = [];

const LogicGateFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<LogicGateNodeType[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<LogicGateEdgeType[]>(initialEdges);

  const computeOutput = (label: string, inputs: number[]): number => {
    switch (label) {
      case "AND":
        return inputs.reduce((acc, val) => acc && val, 1);
      case "OR":
        return inputs.reduce((acc, val) => acc || val, 0);
      case "NOT":
        return inputs[0] === 0 ? 1 : 0;
      default:
        return 0;
    }
  };

  const propagateOutput = useCallback(() => {
    setNodes((nds) => {
      const updatedNodes = [...nds];

      edges.forEach((edge) => {
        const sourceNode = updatedNodes.find((node) => node.id === edge.source);
        const targetNode = updatedNodes.find((node) => node.id === edge.target);

        if (sourceNode && targetNode) {
          const sourceOutput =
            "value" in sourceNode.data
              ? sourceNode.data.value
              : sourceNode.data.output;
          const targetInputIndex = parseInt(
            edge.targetHandle?.split("-")[1] || "0",
            10
          );

          if ("inputs" in targetNode.data) {
            const newInputs = [...targetNode.data.inputs];
            newInputs[targetInputIndex] = sourceOutput;

            const newOutput = computeOutput(targetNode.data.label, newInputs);

            if (
              JSON.stringify(newInputs) !==
                JSON.stringify(targetNode.data.inputs) ||
              newOutput !== targetNode.data.output
            ) {
              const updatedTargetNode = {
                ...targetNode,
                data: {
                  ...targetNode.data,
                  inputs: newInputs,
                  output: newOutput,
                },
              };
              updatedNodes[updatedNodes.indexOf(targetNode)] =
                updatedTargetNode;
              setNodes((prevNodes) =>
                prevNodes.map((node) =>
                  node.id === targetNode.id ? updatedTargetNode : node
                )
              );
            }
          }
        }
      });

      return updatedNodes;
    });
  }, [edges, setNodes]);

  useEffect(() => {
    propagateOutput();
  }, [edges, propagateOutput]);

  const handleInputValueChange = (id: string, value: number) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id && "value" in node.data) {
          return {
            ...node,
            data: {
              ...node.data,
              value,
            },
          };
        }
        return node;
      })
    );

    propagateOutput();
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const addGate = (type: string) => {
    const id = `${nodes.length + 1}`;
    let inputs: number[] = [];
    let label = "";

    switch (type) {
      case "AND Gate":
        inputs = [0, 0];
        label = "AND";
        break;
      case "OR Gate":
        inputs = [0, 0];
        label = "OR";
        break;
      case "NOT Gate":
        inputs = [0];
        label = "NOT";
        break;
      default:
        break;
    }

    const newNode: LogicGateNodeType = {
      id,
      type: "logicGate",
      data: {
        label,
        inputs,
        output: computeOutput(label, inputs),
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const addInputNode = () => {
    const id = `${nodes.length + 1}`;
    const newNode: LogicGateNodeType = {
      id,
      type: "inputNode",
      data: {
        label: `Input ${id}`,
        value: 0,
        onValueChange: handleInputValueChange,
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ height: "100vh" }}>
      <button onClick={addInputNode}>Add Input Node</button>
      <button onClick={() => addGate("AND Gate")}>Add AND Gate</button>
      <button onClick={() => addGate("OR Gate")}>Add OR Gate</button>
      <button onClick={() => addGate("NOT Gate")}>Add NOT Gate</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default LogicGateFlow;
