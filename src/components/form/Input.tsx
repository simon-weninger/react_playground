import { forwardRef, LegacyRef } from "react";
import FormControl from "./FormControl";

type InputProps = {
  name: string;
  label?: string;
  value?: string;
  controlled?: boolean;
  error?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  style?: React.CSSProperties;
  helperText?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/**
 * The Input component
 * @param {InputProps} props
 * @return {ReactElement}
 */
const Input = (
  { name, value, label, error = false, onChange, onBlur, helperText, ...inputProps }: InputProps,
  ref?: LegacyRef<HTMLInputElement>
): JSX.Element => {
  const borderColor = error ? "border-red-500" : "border-gray-800";
  const shadowColor = error ? "focus:shadow-red-100" : "focus:shadow-gray-200";
  return (
    <FormControl label={label} error={error} helperText={helperText}>
      <input
        ref={ref}
        name={name}
        className={`rounded p-2 border outline-none focus:shadow-md ${shadowColor} ${borderColor}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FormControl>
  );
};

export default forwardRef(Input);
