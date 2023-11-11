import {
  ArrowUturnLeftIcon,
  ClipboardDocumentIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useActiveStringBuilderId } from "../ActiveStringBuilderContext";
import { usePixelBuilder } from "./PixelBuilderContext";
import PixelBuilderToolBarButton from "./PixelBuilderToolBarButton";
import { sortAndRemoveNestedElements } from "./pixelBuilderHelperFunctions";

interface PixelBuilderToolBarProps {
  pixelBuilderId: string;
}
/**
 * The PixelBuilderToolBar component
 * @param {PixelBuilderToolBarProps} props
 * @return {ReactElement}
 */
const PixelBuilderToolBar = ({ pixelBuilderId }: PixelBuilderToolBarProps): JSX.Element => {
  const {
    context: { history, elements, selected },
    dispatch,
  } = usePixelBuilder();

  const [activeBuilderId] = useActiveStringBuilderId();

  const handleKeyPress = (e: KeyboardEvent) => {
    if (activeBuilderId === pixelBuilderId) {
      if (e.key === "Delete" || e.key === "Backspace") {
        dispatch({ type: "removeElements", elements: selected });
      }
      if (e.ctrlKey && e.key === "z") {
        dispatch({ type: "undo" });
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        dispatch({ type: "duplicate", elements: selected });
      }
      if (e.ctrlKey && e.key === "c" && selected.length > 0) {
        dispatch({ type: "copy", elements: selected });
      }
      if (e.ctrlKey && e.key === "v" && selected.length > 0) {
        handlePaste();
      }
    }
  };

  const handlePaste = () => {
    const sortedSelected = sortAndRemoveNestedElements(selected, elements);
    dispatch({ type: "pasteFromClipboard", elementIdToInsertBefore: sortedSelected[0].id });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selected, elements, activeBuilderId]);

  const undoButtonDisabled = history.length === 0;
  const nothingSelected = selected.length === 0;

  return (
    <>
      <div className="flex gap-2 border-b pb-2 ">
        <PixelBuilderToolBarButton
          icon={<ArrowUturnLeftIcon className="h-5" />}
          disabled={undoButtonDisabled}
          toolTip="Undo [ctrl +z]"
          onClick={() => {
            if (!undoButtonDisabled) dispatch({ type: "undo" });
          }}
        />
        <PixelBuilderToolBarButton
          icon={<TrashIcon className="h-5" />}
          disabled={nothingSelected}
          toolTip="Delete [delete/backspace]"
          onClick={() => {
            if (!nothingSelected) dispatch({ type: "removeElements", elements: selected });
          }}
        />
        <PixelBuilderToolBarButton
          icon={<CubeIcon className="h-5" />}
          disabled={nothingSelected}
          toolTip="Wrap In ContentBlock"
          onClick={() => {
            if (!nothingSelected) dispatch({ type: "wrapInContentBlock", elements: selected });
          }}
        />
        <PixelBuilderToolBarButton
          icon={<UsersIcon className="h-5" />}
          disabled={nothingSelected}
          toolTip="Duplicate [ctrl + d]"
          onClick={() => {
            if (!nothingSelected) dispatch({ type: "duplicate", elements: selected });
          }}
        />
        <PixelBuilderToolBarButton
          icon={<DocumentDuplicateIcon className="h-5" />}
          disabled={nothingSelected}
          toolTip="Copy To Clipboard [ctrl + c]"
          onClick={() => {
            if (!nothingSelected) dispatch({ type: "copy", elements: selected });
          }}
        />
        <PixelBuilderToolBarButton
          icon={<ClipboardDocumentIcon className="h-5" />}
          disabled={nothingSelected}
          toolTip="Paste From Clipboard [ctrl + v]"
          onClick={() => {
            if (!nothingSelected) handlePaste();
          }}
        />
      </div>
    </>
  );
};

export default PixelBuilderToolBar;
