import { useStringBuilder } from "./StringBuilderContextNew";
import { FunctionElement, StringBuilderElement } from "./classes/AbstractElement";
import { metaPixelBasicPayload } from "./data-mock";
import DragElement from "./elements/DragElement";
import DropZone from "./elements/DropZone";

const StringBuilder = (): JSX.Element => {
  const {
    context: { elements, selected },
    dispatch,
  } = useStringBuilder();

  return (
    <div className="ring-1 ring-gray-200 shadow m-2 rounded-md ">
      <button
        className="bg-green-400  p-1 rounded"
        onClick={() => dispatch({ type: "removeElements", elements: selected })}
      >
        Delete Selected
      </button>
      <button className="bg-green-400  p-1 rounded" onClick={() => dispatch({ type: "unselectAll" })}>
        Unselect All
      </button>
      <div className="flex flex-wrap items-center gap-y-2 p-2">
        {metaPixelBasicPayload.map((element) => (
          <DragElement key={element.getId() + "-drag"} element={element} disabled />
        ))}
        {elements.map((element) => (
          <>
            <DropZone key={element.getId() + "-drop"} elementId={element.getId()} />
            <DragElement key={element.getId() + "-drag"} element={element} />
          </>
        ))}
        <DropZone elementId="last" />
      </div>
    </div>
  );
};

export default StringBuilder;

const startTransferData = (e: DragEvent, elements: StringBuilderElement[]) => {
  e.dataTransfer?.setData("elements", JSON.stringify(elements));
};

const getTransferredData = (e: DragEvent): StringBuilderElement[] => {
  return JSON.parse(e.dataTransfer?.getData("elements") || "[]");
};
