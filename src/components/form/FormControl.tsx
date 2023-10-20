import { useState } from "react";

interface FormControlProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  children?: React.ReactNode;
}
/**
 * The FormControl component
 * @param {FormControlProps} props
 * @return {ReactElement}
 */
const FormControl = (props: FormControlProps): JSX.Element => {
  const textColor = props.error ? "text-red-500" : "text-gray-500";

  return (
    <div className="flex flex-col">
      <span className={`${textColor}  text-sm mb-1`}>{props.label}</span>
      {props.children}
      <span className={`${textColor} text-xs ml-3 mt-1 h-5`}>
        {props.helperText}
      </span>
    </div>
  );
};

export default FormControl;
