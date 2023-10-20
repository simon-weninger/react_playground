import { useFormContext } from "react-hook-form";
import Input from "../../components/form/Input";
import { TOverrideValue } from "../types";

interface OverrideValueProps<TType> {
  rootInputName: string;
  overrideValue: TOverrideValue<TType>;
}
/**
 * The OverrideValue component
 * @param {OverrideValueProps} props
 * @return {ReactElement}
 */
function OverrideValue<TType>({
  rootInputName,
  overrideValue: { containerId, environmentId, value },
}: OverrideValueProps<TType>): JSX.Element {
  const { register, formState } = useFormContext();

  return (
    <>
      <Input
        label={`${containerId} ${environmentId}`}
        {...register(`${rootInputName}.value`, { value })}
        error={!!formState.errors[`${rootInputName}.value`]}
      />
      <input
        hidden
        {...register(`${rootInputName}.containerId`, {
          value: containerId,
        })}
      />
      <input
        hidden
        {...register(`${rootInputName}.environmentId`, {
          value: environmentId,
        })}
      />
    </>
  );
}

export default OverrideValue;
