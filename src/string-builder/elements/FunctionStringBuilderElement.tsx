import { FunctionElement } from "../classes/AbstractElement";
import DragElement from "./DragElement";
import DropZone from "./DropZone";

interface FunctionStringBuilderElementProps {
  element: FunctionElement;
}
/**
 * The FunctionStringBuilderElement component
 * @param {FunctionStringBuilderElementProps} props
 * @return {ReactElement}
 */
const FunctionStringBuilderElement = ({ element }: FunctionStringBuilderElementProps): JSX.Element => {
  return (
    <div className="flex flex-wrap gap-y-2 items-center py-1 px-2 rounded bg-fuchsia-100 border border-fuchsia-400">
      <span className="text-fuchsia-900">{element.getLabel()}</span>
      {element.getChildren().map((element) => (
        <>
          <DropZone key={element.getId() + "-drop"} elementId={element.getId()} />
          <DragElement key={element.getId() + "-drag"} element={element} />
        </>
      ))}
      <DropZone elementId={element.getChildrenId()} />
    </div>
  );
};

export default FunctionStringBuilderElement;
