import DisplayContainer from "./DisplayContainer";
import FormContainer from "./FormContainer";

interface ComponentWrapperProps {}
/**
 * The ComponentWrapper component
 * @param {ComponentWrapperProps} props
 * @return {ReactElement}
 */
const ComponentWrapper = ({}: ComponentWrapperProps): JSX.Element => {
  return (
    <div className="p-12 m-12 border rounded-md">
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

export default ComponentWrapper;
