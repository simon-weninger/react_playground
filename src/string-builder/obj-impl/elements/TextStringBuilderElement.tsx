import { useEffect, useRef } from "react";
import ContentEditable from "../ContentEditable";
import Example from "@src/components/Menu";
import { PixelBuilderText } from "../types";

interface TextStringBuilderElementProps {
  element: PixelBuilderText;
}
/**
 * The TextStringBuilderElement component
 * @param {TextStringBuilderElementProps} props
 * @return {ReactElement}
 */
const TextStringBuilderElement = ({ element }: TextStringBuilderElementProps): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null);

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    alert("TODO");
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.addEventListener("contextmenu", onContextMenu);
      return () => {
        divRef.current?.removeEventListener("contextmenu", onContextMenu);
      };
    }
  }, []);

  return (
    <div ref={divRef} className=" p-1 flex rounded bg-slate-50 border border-slate-200">
      <ContentEditable
        elementId={element.id}
        style={{ color: element.color }}
        text={element.value}
        onChange={(value: string) => {
          element.value = value;
        }}
      />
      <Example />
    </div>
  );
};

export default TextStringBuilderElement;
