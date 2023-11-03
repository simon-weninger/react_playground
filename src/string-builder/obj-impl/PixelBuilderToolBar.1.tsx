import {
  ArrowUturnLeftIcon,
  ClipboardDocumentCheckIcon,
  CubeIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { usePixelBuilder } from "./PixelBuilderContext";
import PixelBuilderToolBarButton from "./PixelBuilderToolBarButton";
import { useEffect } from "react";
import { useActiveStringBuilderId } from "../ActiveStringBuilderContext";
import ReactTooltip from "react-tooltip";
import { PixelBuilderToolBarProps } from "./PixelBuilderToolBar";

/**
 * The PixelBuilderToolBar component
 * @param {PixelBuilderToolBarProps} props
 * @return {ReactElement}
 */
export const PixelBuilderToolBar = ({ pixelBuilderId }: PixelBuilderToolBarProps): JSX.Element => {
  const {
    context: { history, selected },
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
        dispatch({ type: "duplicateSelected" });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selected, activeBuilderId]);

  const undoButtonDisabled = history.length === 0;
  const nothingSelected = selected.length === 0;

  return (
    <div className="flex gap-2 border-b pb-2 ">
      <ReactTooltip>
        <PixelBuilderToolBarButton
          icon={<ArrowUturnLeftIcon className="h-5" />}
          disabled={undoButtonDisabled}
          onClick={() => {
            if (!undoButtonDisabled) dispatch({ type: "undo" });
          }}
        />
      </ReactTooltip>
      <PixelBuilderToolBarButton
        icon={<TrashIcon className="h-5" />}
        disabled={nothingSelected}
        onClick={() => {
          if (!nothingSelected) dispatch({ type: "removeElements", elements: selected });
        }}
      />
      <PixelBuilderToolBarButton
        icon={<CubeIcon className="h-5" />}
        disabled={nothingSelected}
        onClick={() => {
          if (!nothingSelected) dispatch({ type: "wrapInContentBlock" });
        }}
      />
      <PixelBuilderToolBarButton
        icon={<UsersIcon className="h-5" />}
        disabled={nothingSelected}
        onClick={() => {
          if (!nothingSelected) dispatch({ type: "duplicateSelected" });
        }}
      />
      <PixelBuilderToolBarButton
        icon={<ClipboardDocumentCheckIcon className="h-5" />}
        disabled={nothingSelected}
        onClick={() => {
          if (!nothingSelected) dispatch({ type: "duplicateSelected" });
        }}
      />
    </div>
  );
};
