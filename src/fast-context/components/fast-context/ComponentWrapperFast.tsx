import DisplayContainerFast from "./DisplayContainerFast";
import FormContainerFast from "./FormContainerFast";

interface ComponentWrapperProps {}
/**
 * The ComponentWrapper component
 * @param {ComponentWrapperProps} props
 * @return {ReactElement}
 */
const ComponentWrapperFast = ({}: ComponentWrapperProps): JSX.Element => {
  return (
    <div className="p-12 m-12 border rounded-md">
      <FormContainerFast />
      <DisplayContainerFast value="first" />
      <DisplayContainerFast value="second" />
    </div>
  );
};

export default ComponentWrapperFast;
