import { useFormContext } from "react-hook-form";
import FormControl from "../../components/form/FormControl";
import Input from "../../components/form/Input";
import { useEffect } from "react";
import { allContainerIds, allEnvironmentIds } from "../data";
import { TOverrideValue } from "../types";
import OverrideValue from "./OverrideValue";

interface DefaultOverrideValueProps {
  rootName: string;
}
/**
 * The DefaultOverrideValue component
 * @param {DefaultOverrideValueProps} props
 * @return {ReactElement}
 */

const DefaultOverrideValueHOOKFORM = ({
  rootName,
}: DefaultOverrideValueProps): JSX.Element => {
  const { getValues, setValue, register, unregister } = useFormContext();

  const overrideValues: TOverrideValue<string>[] = getValues(
    `${rootName}.overrideValues`
  );

  const getValueByContainerAndEnv = (conId: number, envId: number) => {
    return (
      overrideValues.find(
        (val) => val.containerId === conId && val.environmentId === envId
      ) || { value: "", containerId: conId, environmentId: envId }
    );
  };

  useEffect(() => {
    return () => {
      const filteredValues = getValues("temp_overrideValues").filter(
        (val: TOverrideValue<string>) => val.value
      );

      setValue(`${rootName}.overrideValues`, filteredValues);
      unregister("temp_overrideValues");
    };
  }, []);

  return (
    <div className="border rounded p-2">
      <FormControl label="Field 2">
        <Input {...register(`${rootName}.value`)} />
      </FormControl>
      <div className=" flex">
        {allContainerIds.map((conId) => {
          return allEnvironmentIds.map((envId) => {
            return (
              <OverrideValue
                key={`${conId}${envId}`}
                rootInputName={`temp_overrideValues.${conId}${envId}`}
                overrideValue={getValueByContainerAndEnv(conId, envId)}
              />
            );
          });
        })}
      </div>
    </div>
  );
};

export default DefaultOverrideValueHOOKFORM;
