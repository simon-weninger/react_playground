import { generateId } from "../utils";
import { JentisFunction, JentisPlaceholder } from "../jentis-types";
import {
  PixelBuilderContentBlock,
  PixelBuilderElement,
  PixelBuilderFunction,
  PixelBuilderPlaceholder,
  PixelBuilderText,
} from "./types";

export const createTextElement = (value: string, color?: string): PixelBuilderText => {
  return {
    id: generateId(),
    type: "TEXT",
    value,
    label: value,
    color,
  };
};

export const createPlaceholderElement = (
  placeholder: JentisPlaceholder,
  optional: boolean,
  stringBefore?: string,
  stringAfter?: string
): PixelBuilderPlaceholder => {
  return {
    id: generateId(),
    type: "PLACEHOLDER",
    label: placeholder.label,
    placeholder: placeholder,
    optional,
    stringBefore,
    stringAfter,
  };
};

export const createFunctionElement = (
  fn: JentisFunction,
  stringBefore: string,
  stringAfter: string,
  children: PixelBuilderElement[]
): PixelBuilderFunction => {
  return {
    id: generateId(),
    type: "FUNCTION",
    fn,
    label: fn.label,
    stringBefore,
    stringAfter,
    children,
    childrenId: generateId(),
  };
};
export const createContentBlock = (children: PixelBuilderElement[]): PixelBuilderContentBlock => {
  return {
    id: generateId(),
    type: "CONTENT_BLOCK",
    label: "Content Block",
    children,
    childrenId: generateId(),
  };
};
