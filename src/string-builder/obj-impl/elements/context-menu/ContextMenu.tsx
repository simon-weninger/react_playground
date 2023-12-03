import {
  ClipboardDocumentIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { ReactNode } from "react";
import { usePixelBuilder } from "../../PixelBuilderContext";
import { PixelBuilderElement } from "../../types";
import ContextMenuItem from "./ContextMenuItem";
import { findElement } from "../../pixelBuilderHelperFunctions";

interface ContextMenuProps {
  element: PixelBuilderElement;
  children?: ReactNode;
}
/**
 * The ContextMenu component
 * @param {ContextMenuProps} props
 * @return {ReactElement}
 */
const ContextMenu = ({ element, children }: ContextMenuProps): JSX.Element => {
  const {
    context: { selected, drag },
    dispatch,
  } = usePixelBuilder();

  const actionElements = findElement(element.id, selected) ? selected : [element];

  return (
    <RadixContextMenu.Portal>
      <RadixContextMenu.Content className="min-w-[220px] bg-white rounded-md overflow-hidden p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <ContextMenuItem
          label="Delete"
          icon={TrashIcon}
          onClick={() => {
            dispatch({ type: "removeElements", elements: actionElements });
          }}
        />
        <ContextMenuItem
          label="Copy"
          icon={DocumentDuplicateIcon}
          onClick={() => {
            dispatch({ type: "copy", elements: actionElements });
          }}
        />
        <ContextMenuItem
          label="Duplicate"
          icon={UsersIcon}
          onClick={() => {
            dispatch({ type: "duplicate", elements: actionElements });
          }}
        />
        <ContextMenuItem
          label="Insert Before"
          icon={ClipboardDocumentIcon}
          onClick={() => {
            dispatch({ type: "pasteFromClipboard", elementIdToInsertBefore: element.id });
          }}
        />
        <ContextMenuItem
          label="Wrap In Content Block"
          icon={CubeIcon}
          onClick={() => {
            dispatch({ type: "wrapInContentBlock", elements: actionElements });
          }}
        />
        <RadixContextMenu.Separator className="h-[1px] bg-blue-100 m-[5px]" />
        {children}
      </RadixContextMenu.Content>
    </RadixContextMenu.Portal>
  );
};

export default ContextMenu;
