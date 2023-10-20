import { useContext } from "react";
import { TestContext } from "../../../pages/FastContext";

interface DisplayContainerProps {}
/**
 * The DisplayContainer component
 * @param {DisplayContainerProps} props
 * @return {ReactElement}
 */
const DisplayContainer = ({}: DisplayContainerProps): JSX.Element => {
  const context = useContext(TestContext);

  if (!context) {
    throw new Error("Store is null");
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="bg-blue-100 rounded-md p-2 min-h-[40px]">
        {context.value.first}
      </div>
      <div className="bg-blue-100 rounded-md p-2 min-h-[40px]">
        {context.value.second}
      </div>
    </div>
  );
};

export default DisplayContainer;
