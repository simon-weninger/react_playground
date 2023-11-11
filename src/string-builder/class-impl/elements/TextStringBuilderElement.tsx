import { useEffect, useRef } from "react";
import ContentEditable from "../ContentEditable";
import { TextElement } from "../classes/AbstractElement";
import Example from "@src/components/Menu";

interface TextStringBuilderElementProps {
  element: TextElement;
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
    <div ref={divRef} className=" p-1 flex rounded bg-gray-50 border border-gray-200">
      <ContentEditable
        elementId={element.getId()}
        style={{ color: element.getColor() }}
        text={element.getLabel()}
        onChange={(value: string) => {
          element.setValue(value);
        }}
      />
      <Example />
    </div>
  );
};

export default TextStringBuilderElement;
