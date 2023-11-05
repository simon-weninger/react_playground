import { PixelBuilderElement } from "./obj-impl/types";

export interface AbstractJentisPlaceholder {
  id: string;
  name: string;
  desc: string;
  group: string;
  optional: boolean;
  type?: "arraylist" | "guilist";
}

export interface NormalJentisPlaceholder extends AbstractJentisPlaceholder {
  type: undefined;
  hash: boolean;
  value: string;
}

export interface GuiListJentisPlaceholder extends AbstractJentisPlaceholder {
  type: "guilist";
  entries: Record<string, { desc: string; name: string }>;
  payload: PixelBuilderElement[];
  stream: PixelBuilderElement[];
  options?: {
    separator?: string;
    counter_start_value?: number;
  };
}

export interface ArrayListJentisPlaceholder extends AbstractJentisPlaceholder {
  type: "arraylist";
  filter: {
    value: string;
    operator: "eq";
    variable: string;
  };
  payload: PixelBuilderElement[];
  stream: PixelBuilderElement[];
  options?: {
    separator?: string;
    counter_start_value?: number;
  };
}

export type JentisPlaceholder = NormalJentisPlaceholder | GuiListJentisPlaceholder | ArrayListJentisPlaceholder;

export type JentisFunction = {
  id: string;
  name: string;
};
