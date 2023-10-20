import { useState } from "react";

interface AutoGrowingInputProps {
  defaultValue?: string;
}
/**
 * The AutoGrowingInput component
 * @param {AutoGrowingInputProps} props
 * @return {ReactElement}
 */
const AutoGrowingInput = ({ defaultValue = "" }: AutoGrowingInputProps): JSX.Element => {
  const [value, changeValue] = useState(defaultValue);

  return (
    <div
      className="auto-grow-input"
      style={{
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "start",
      }}
    >
      <input
        value={value}
        onChange={(event) => changeValue(event.target.value)}
        style={{
          gridArea: "1 / 1 / 2 / 2",
          width: "100%",
          padding: 0,
          border: "none",
        }}
      />
      <span
        style={{
          gridArea: "1 / 1 / 2 / 2",
          visibility: "hidden",
        }}
      >
        {value}
      </span>
    </div>
  );
  //   return (
  //     <input
  //       style={{ width: Math.min(Math.max(value.length, 2), 50) + "ch" }}
  //       value={value}
  //       onChange={(event) => {
  //         changeValue(event.target.value);
  //       }}
  //     />
  //   );
};

export default AutoGrowingInput;
