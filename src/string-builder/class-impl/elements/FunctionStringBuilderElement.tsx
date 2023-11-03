import { Fragment } from "react";
import ContentEditable from "../ContentEditable";
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
    <div className="flex flex-wrap gap-y-2 items-center px-2 rounded bg-fuchsia-50 ">
      <ContentEditable
        elementId={element.getId()}
        className="pr-1"
        text={element.getStringBefore()}
        onChange={(value: string) => element.setStringBefore(value)}
      />
      <div className="flex flex-wrap gap-y-2 items-center py-1 px-2 rounded bg-fuchsia-100 border border-fuchsia-400">
        <span className="text-fuchsia-900">{element.getLabel()}</span>
        {element.getChildren().map((element) => (
          <Fragment key={element.getId()}>
            <DropZone elementId={element.getId()} />
            <DragElement element={element} />
          </Fragment>
        ))}
        <DropZone elementId={element.getChildrenId()} />
      </div>
      <ContentEditable
        elementId={element.getId()}
        className="pl-1"
        text={element.getStringAfter()}
        onChange={(value: string) => element.setStringAfter(value)}
      />
    </div>
  );
};

export default FunctionStringBuilderElement;
