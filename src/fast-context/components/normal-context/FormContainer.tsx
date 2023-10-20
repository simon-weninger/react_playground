import { useContext, useState } from "react";
import { TestContext } from "../../../pages/FastContext";

interface FormContainerProps {}
/**
 * The FormContainer component
 * @param {FormContainerProps} props
 * @return {ReactElement}
 */
const FormContainer = ({}: FormContainerProps): JSX.Element => {
  const context = useContext(TestContext);

  if (!context) {
    throw new Error("Store is null");
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <input
        className="border border-blue-900 rounded-md p-2"
        value={context.value.first}
        onChange={(e) => {
          context.setValue((old) => {
            const newObj = JSON.parse(JSON.stringify(old));
            newObj.first = e.target.value;
            return newObj;
          });
        }}
      />
      <input
        className="border border-blue-900 rounded-md p-2"
        value={context.value.second}
        onChange={(e) => {
          context.setValue((old) => {
            const newObj = JSON.parse(JSON.stringify(old));
            newObj.second = e.target.value;
            return newObj;
          });
        }}
      />
    </div>
  );
};

export default FormContainer;
