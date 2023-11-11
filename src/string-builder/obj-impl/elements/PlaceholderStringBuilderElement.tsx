import {
  ArrowPathIcon,
  BookmarkIcon,
  ListBulletIcon,
  LockClosedIcon,
  Square3Stack3DIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { JentisPlaceholder } from "@src/string-builder/jentis-types";
import { useState } from "react";
import ContentEditable from "../ContentEditable";
import { usePixelBuilder } from "../PixelBuilderContext";
import { PixelBuilderPlaceholder } from "../types";
import ContextMenu from "./context-menu/ContextMenu";
import ContextMenuItem from "./context-menu/ContextMenuItem";
import Placeholder from "./placeholder-context/PlaceholderContext";

interface PlaceholderStringBuilderElementProps {
  element: PixelBuilderPlaceholder;
  disabled?: boolean;
}
/**
 * The PlaceholderStringBuilderElement component
 * @param {PlaceholderStringBuilderElementProps} props
 * @return {ReactElement}
 */
const PlaceholderStringBuilderElement = ({
  element,
  disabled = false,
}: PlaceholderStringBuilderElementProps): JSX.Element => {
  const { dispatch } = usePixelBuilder();
  const [placeholderWasChanged, setPlaceholderWasChanged] = useState(false);

  let placeholderColorStyles = placeholderWasChanged ? "bg-sky-600 text-white" : "bg-sky-200 text-sky-900";

  let optionalBorderStyle = "";
  if (element.optional) {
    optionalBorderStyle = "border-l-2 border-r-2 rounded-xl ";
    optionalBorderStyle += placeholderWasChanged
      ? "border-l-sky-600 border-r-sky-600"
      : "border-l-sky-300 border-r-sky-300";
  }
  let wrapperColorStyles = "bg-white ring-1 ring-gray-100 " + optionalBorderStyle;

  let icon = <BookmarkIcon className="h-4" />;

  if (element.placeholder.type === "arraylist") {
    icon = <Square3Stack3DIcon className="h-4" />;
  }

  if (element.placeholder.type === "guilist") {
    icon = <ListBulletIcon className="h-4" />;
  }

  const changePlaceholderFunction = (ph: JentisPlaceholder) => {
    dispatch({ type: "changePlaceholder", newPlaceholder: ph, element });
    setPlaceholderWasChanged(true);
    setTimeout(() => setPlaceholderWasChanged(false), 800);
  };

  return (
    <div className={"flex items-center px-1 rounded text-sky-950 transition-colors duration-300 " + wrapperColorStyles}>
      <ContentEditable
        elementId={element.id}
        className="pr-1"
        text={element.stringBefore}
        onChange={(value: string) => (element.stringBefore = value)}
      />
      <div
        className={"flex items-center gap-2 py-1 px-2 rounded transition-colors duration-300 " + placeholderColorStyles}
      >
        {icon}
        {element.placeholder.name}
      </div>
      <ContentEditable
        elementId={element.id}
        className="pl-1"
        text={element.stringAfter}
        onChange={(value: string) => (element.stringAfter = value)}
      />
      {!disabled && (
        <ContextMenu element={element}>
          <Placeholder.trigger changePlaceholderFn={changePlaceholderFunction}>
            <ContextMenuItem label="Change Placeholder" icon={ArrowPathIcon} />
          </Placeholder.trigger>
          <ContextMenuItem
            label="Toggle Optional"
            icon={LockClosedIcon}
            onClick={() => {
              dispatch({ type: "changeOptional", element });
            }}
          />
        </ContextMenu>
      )}
    </div>
  );
};

export default PlaceholderStringBuilderElement;

export const PlaceholderTypeIcon = ({ type, className }: { type: JentisPlaceholder["type"]; className?: string }) => {
  let icon = <StarIcon className={"h-4 " + className} />;

  if (type === "arraylist") {
    icon = <Square3Stack3DIcon className={"h-4 " + className} />;
  }

  if (type === "guilist") {
    icon = <ListBulletIcon className={"h-4 " + className} />;
  }

  return icon;
};
