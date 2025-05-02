import React from "react";
import { Handle, NodeProps } from "reactflow";

type InputNodeData = {
  label: string;
  value: number;
  onValueChange: (id: string, value: number) => void;
};

const InputNode: React.FC<NodeProps<InputNodeData>> = ({ id, data }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10) || 0;
    data.onValueChange(id, newValue);
  };

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid black",
        borderRadius: 5,
        textAlign: "center",
      }}
    >
      <div>{data.label}</div>

      <input
        type="number"
        value={data.value}
        onChange={handleChange}
        style={{ width: "50px", margin: "10px 0" }}
      />

      <Handle
        type="source"
        position="right"
        id="output"
        style={{ top: "50%", background: "#555" }}
      />
    </div>
  );
};

export default InputNode;
