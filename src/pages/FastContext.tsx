import { createContext, useState } from "react";
import ComponentWrapperFast from "../fast-context/components/fast-context/ComponentWrapperFast";
import ComponentWrapper from "../fast-context/components/normal-context/ComponentWrapper";
import DisplayContainer from "../fast-context/components/normal-context/DisplayContainer";
import createFastContext from "../fast-context/hooks/createFastContext";

export const TestContext = createContext<null | {
  value: { first: string; second: string };
  setValue: React.Dispatch<
    React.SetStateAction<{ first: string; second: string }>
  >;
}>(null);

type dataType = { [key: string]: string };

export const FastTestContext = createFastContext<dataType>({
  first: "",
  second: "",
});

const FastContext = (): JSX.Element => {
  const [value, setValue] = useState({ first: "", second: "" });

  return (
    <div>
      <TestContext.Provider value={{ value, setValue }}>
        <ComponentWrapper />
      </TestContext.Provider>
      <FastTestContext.Provider>
        <ComponentWrapperFast />
      </FastTestContext.Provider>
    </div>
  );
};

export default FastContext;
