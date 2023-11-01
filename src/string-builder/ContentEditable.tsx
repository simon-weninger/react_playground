import { useEffect, useRef, useState } from "react";

interface ContentEditableProps {
  text?: string;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
  className?: string;
}
/**
 * The ContentEditable component
 * @param {ContentEditableProps} props
 * @return {ReactElement}
 */
const ContentEditable = ({ text = "", style, onChange, className }: ContentEditableProps): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = () => {
    if (divRef.current) {
      divRef.current.contentEditable = "true";
      divRef.current.focus();
      divRef.current.style.cursor = "text";
    }
  };
  const handleOnBlur = () => {
    if (divRef.current) {
      divRef.current.contentEditable = "false";
      divRef.current.style.cursor = "";
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
