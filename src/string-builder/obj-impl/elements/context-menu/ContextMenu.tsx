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

        {/* <RadixContextMenu.Sub>
          <RadixContextMenu.SubTrigger className="group text-[13px] leading-none text-sky-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-violet4 data-[state=open]:text-sky-800 data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-900 data-[highlighted]:text-sky-50 data-[highlighted]:data-[state=open]:bg-sky-900 data-[highlighted]:data-[state=open]:text-sky-50">
            More Tools
            <div className="ml-auto pl-5 text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-gray-300">
              <ChevronRightIcon />
            </div>
          </RadixContextMenu.SubTrigger>
          <RadixContextMenu.Portal>
            <RadixContextMenu.SubContent
              className="min-w-[220px] bg-white rounded-md overflow-hidden p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
              sideOffset={2}
              alignOffset={-5}
            >
              <RadixContextMenu.Item className="group text-[13px] leading-none text-sky-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-900 data-[highlighted]:text-sky-50">
                Save Page As…{" "}
                <div className="ml-auto pl-5 text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-gray-300">
                  ⌘+S
                </div>
              </RadixContextMenu.Item>
              <RadixContextMenu.Item className="text-[13px] leading-none text-sky-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-900 data-[highlighted]:text-sky-50">
                Create Shortcut…
              </RadixContextMenu.Item>
              <RadixContextMenu.Item className="text-[13px] leading-none text-sky-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-900 data-[highlighted]:text-sky-50">
                Name Window…
              </RadixContextMenu.Item>
              <RadixContextMenu.Separator className="h-[1px] bg-sky-100 m-[5px]" />
              <RadixContextMenu.Item className="text-[13px] leading-none text-sky-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-900 data-[highlighted]:text-sky-50">
                Developer Tools
              </RadixContextMenu.Item>
            </RadixContextMenu.SubContent>
          </RadixContextMenu.Portal>
        </RadixContextMenu.Sub> */}

        <RadixContextMenu.Separator className="h-[1px] bg-sky-100 m-[5px]" />
        {children}
        {/* <RadixContextMenu.Separator className="h-[1px] bg-sky-100 m-[5px]" />

        <RadixContextMenu.Label className="pl-[25px] text-xs leading-[25px] text-mauve11">
          People
        </RadixContextMenu.Label> */}
        {/* <RadixContextMenu.RadioGroup value={person} onValueChange={setPerson}>
          <RadixContextMenu.RadioItem
            className="text-[13px] leading-none text-sky-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-900 data-[highlighted]:text-sky-50"
            value="pedro"
          >
            <RadixContextMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <CheckIcon className="h-4" />
            </RadixContextMenu.ItemIndicator>
            Pedro Duarte
          </RadixContextMenu.RadioItem>
          <RadixContextMenu.RadioItem
            className="text-[13px] leading-none text-sky-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-sky-900 data-[highlighted]:text-sky-50"
            value="colm"
          >
            <RadixContextMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <CheckIcon className="h-4" />
            </RadixContextMenu.ItemIndicator>
            Colm Tuite
          </RadixContextMenu.RadioItem>
        </RadixContextMenu.RadioGroup> */}
      </RadixContextMenu.Content>
    </RadixContextMenu.Portal>
  );
};

export default ContextMenu;
