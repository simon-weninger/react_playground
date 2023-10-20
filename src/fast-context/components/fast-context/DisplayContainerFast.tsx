import { useContext } from "react";
import { FastTestContext, TestContext } from "../../../pages/FastContext";

interface DisplayContainerProps {
  value: string;
}
/**
 * The DisplayContainer component
 * @param {DisplayContainerProps} props
 * @return {ReactElement}
 */
const DisplayContainerFast = ({
  value,
}: DisplayContainerProps): JSX.Element => {
  const useStore = FastTestContext.useStore;
  const [fieldValue] = useStore((store) => store[value]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="bg-blue-100 rounded-md p-2 min-h-[40px]">
        {fieldValue}
      </div>
    </div>
  );
};

export default DisplayContainerFast;
