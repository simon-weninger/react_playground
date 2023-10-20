import { useState } from "react";
import FormControl from "../../../components/form/FormControl";
import Input from "../../../components/form/Input";
import { Select, SelectOption } from "../../../components/Select";
import { FastTestContext, TestContext } from "../../../pages/FastContext";

interface FormContainerProps {}
/**
 * The FormContainer component
 * @param {FormContainerProps} props
 * @return {ReactElement}
 */
const FormContainerFast = ({}: FormContainerProps): JSX.Element => {
  const useStore = FastTestContext.useStore;
  const [fieldValue, setStore] = useStore((store) => store["first"]);
  const [fieldValue2, setStore2] = useStore((store) => store["second"]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <Input
        name="field1"
        value={fieldValue}
        onChange={(e) => {
          setStore({ first: e.target.value });
        }}
      />
      <Input
        name="field2"
        value={fieldValue2}
        error
        onChange={(e) => {
          setStore2({ second: e.target.value });
        }}
      />
    </div>
  );
};

export default FormContainerFast;
