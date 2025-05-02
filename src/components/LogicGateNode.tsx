import React from "react";
import { Handle, NodeProps } from "reactflow";

type LogicGateNodeData = {
  label: string;
  inputs: number[];
  output: number;
};

const LogicGateNode: React.FC<NodeProps<LogicGateNodeData>> = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid black",
        borderRadius: 5,
        textAlign: "center",
      }}
    >
      {data.inputs.map((_, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position="left"
          id={`input-${index}`}
          style={{ top: `${(index + 1) * 20}px`, background: "#555" }}
        />
      ))}

      <div style={{ margin: "10px 0" }}>{data.label}</div>

      <div>
        <span>Output: {data.output}</span>
        <Handle
          type="source"
          position="right"
          id="output"
          style={{ top: "50%", background: "#555" }}
        />
      </div>
    </div>
  );
};

export default LogicGateNode;
