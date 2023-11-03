import { JentisFunction, JentisPlaceholder } from "../jentis-types";

export type PixelBuilderElementTypes = "TEXT" | "PLACEHOLDER" | "FUNCTION" | "CONTENT_BLOCK";

interface AbstractPixelBuilderElement {
  id: string;
  type: PixelBuilderElementTypes;
}

export interface PixelBuilderPlaceholder extends AbstractPixelBuilderElement {
  type: "PLACEHOLDER";
  label: string;
  placeholder: JentisPlaceholder;
  optional: boolean;
  stringBefore?: string;
  stringAfter?: string;
}

export interface PixelBuilderFunction extends AbstractPixelBuilderElement {
  type: "FUNCTION";
  label: string;
  fn: JentisFunction;
  childrenId: string;
  children: PixelBuilderElement[];
  stringBefore?: string;
  stringAfter?: string;
}

export interface PixelBuilderText extends AbstractPixelBuilderElement {
  type: "TEXT";
  value: string;
  color?: string;
}

export interface PixelBuilderContentBlock extends AbstractPixelBuilderElement {
  type: "CONTENT_BLOCK";
  label: string;
  childrenId: string;
  children: PixelBuilderElement[];
  color?: string;
}

export type PixelBuilderRecursiveElement = PixelBuilderFunction | PixelBuilderContentBlock;

export type PixelBuilderElement = PixelBuilderPlaceholder | PixelBuilderText | PixelBuilderRecursiveElement;
