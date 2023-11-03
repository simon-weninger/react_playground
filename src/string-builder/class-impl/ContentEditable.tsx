import { useEffect, useRef, useState } from "react";
import { useStringBuilderClass } from "./StringBuilderContextClass";

interface ContentEditableProps {
  elementId: string;
  text?: string;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}
/**
 * The ContentEditable component
 * @param {ContentEditableProps} props
 * @return {ReactElement}
 */
const ContentEditable = ({
  elementId,
  text = "",
  style,
  onChange,
  onBlur,
  className,
}: ContentEditableProps): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useStringBuilderClass();

  const handleDoubleClick = () => {
    if (divRef.current) {
      divRef.current.contentEditable = "true";
      divRef.current.focus();
      divRef.current.style.cursor = "text";
      dispatch({ type: "textChangeStart" });
    }
  };

  const handleOnBlur = () => {
    if (divRef.current) {
      divRef.current.contentEditable = "false";
      divRef.current.style.cursor = "";
      dispatch({ type: "textChangeEnd", elementId });
    }
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.addEventListener("dblclick", handleDoubleClick);
      return () => {
        divRef.current?.removeEventListener("dblclick", handleDoubleClick);
      };
    }
  }, []);

  return (
    <div
      ref={divRef}
      className={`p-1 outline-none min-w-[8px] min-h-[32px] ${className}`}
      style={style}
      onBlur={handleOnBlur}
      onInput={(e) => {
        if (divRef.current) {
          onChange(divRef.current?.innerText);
        }
      }}
    >
      {text}
    </div>
  );
};

export default ContentEditable;
