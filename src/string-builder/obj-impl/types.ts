import { JentisFunction, JentisPlaceholder } from "../jentis-types";

export type PixelBuilderElementTypes = "TEXT" | "PLACEHOLDER" | "FUNCTION" | "CONTENT_BLOCK";

interface AbstractPixelBuilderElement {
  id: string;
  type: PixelBuilderElementTypes;
}

export interface PixelBuilderPlaceholder extends AbstractPixelBuilderElement {
  type: "PLACEHOLDER";
  placeholder: JentisPlaceholder;
  optional: boolean;
  stringBefore?: string;
  stringAfter?: string;
}

export interface PixelBuilderFunction extends AbstractPixelBuilderElement {
  type: "FUNCTION";
  fn: JentisFunction;
  childrenId: string;
  children: PixelBuilderElement[];
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
