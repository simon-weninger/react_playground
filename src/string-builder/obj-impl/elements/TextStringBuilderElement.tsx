import Example from "@src/components/Menu";
import { useRef, useState } from "react";
import ContentEditable from "../ContentEditable";
import { PixelBuilderText } from "../types";
import ContextMenu from "./context-menu/ContextMenu";
import ContextMenuItem from "./context-menu/ContextMenuItem";
import ColorSelection from "./context-menu/ColorSelection";

interface TextStringBuilderElementProps {
  element: PixelBuilderText;
  disabled?: boolean;
}
/**
 * The TextStringBuilderElement component
 * @param {TextStringBuilderElementProps} props
 * @return {ReactElement}
 */
const TextStringBuilderElement = ({ element, disabled = false }: TextStringBuilderElementProps): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(element.color);

  return (
    <div ref={divRef} className="p-1 flex rounded bg-slate-50 border border-slate-200">
      <ContentEditable
        elementId={element.id}
        style={{ color }}
        text={element.value}
        onChange={(value: string) => {
          element.value = value;
        }}
      />
      {!disabled && (
        <ContextMenu element={element}>
          <div className="px-[5px] pb-[5px]">
            <p className="text-sky-800 text-xs mb-0.5">Text Color</p>
            <ColorSelection
              value={color}
              className="bg-zinc-800"
              onChange={(value) => {
                setColor(value);
                element.color = value;
              }}
              onReset={() => {
                setColor(undefined);
                element.color = undefined;
              }}
            />
          </div>
        </ContextMenu>
      )}
    </div>
  );
};

export default TextStringBuilderElement;
