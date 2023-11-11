import { Fragment } from "react";
import ContentEditable from "../ContentEditable";
import { PixelBuilderFunction } from "../types";
import DragElement from "./DragElement";
import DropZone from "./DropZone";
import { VariableIcon } from "@heroicons/react/24/outline";
import ContextMenu from "./context-menu/ContextMenu";

interface FunctionStringBuilderElementProps {
  element: PixelBuilderFunction;
  disabled?: boolean;
}
/**
 * The FunctionStringBuilderElement component
 * @param {FunctionStringBuilderElementProps} props
 * @return {ReactElement}
 */
const FunctionStringBuilderElement = ({ element, disabled }: FunctionStringBuilderElementProps): JSX.Element => {
  return (
    <div>
      <div className="flex flex-wrap gap-y-2 items-center py-1 px-2 rounded bg-fuchsia-100 border border-fuchsia-400">
        <VariableIcon className="h-4 mr-2 text-fuchsia-900" />
        <span className="text-fuchsia-900">{element.fn.name}</span>
        {element.children.map((element) => (
          <Fragment key={element.id}>
            <DropZone elementId={element.id} />
            <DragElement element={element} />
          </Fragment>
        ))}
        <DropZone elementId={element.childrenId} />
      </div>
      {!disabled && (
        <ContextMenu element={element}>
          <div>TODO</div>
        </ContextMenu>
      )}
    </div>
  );
};

export default FunctionStringBuilderElement;
