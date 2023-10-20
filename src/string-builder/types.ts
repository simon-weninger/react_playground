interface AbstractStringBuilderElement {
  id: string;
  label: string;
  type: "TEXT" | "PLACEHOLDER" | "OPTIONAL_PLACEHOLDER" | "FUNCTION" | "AL_ITERATOR" | "GL_ITERATOR";
}

interface Placeholder extends AbstractStringBuilderElement {
  type: "PLACEHOLDER";
  placeholderId: string;
}

interface OptionalPlaceholder extends AbstractStringBuilderElement {
  type: "OPTIONAL_PLACEHOLDER";
  placeholderId: string;
  stringBefore?: string;
  stringAfter?: string;
}

export interface Function extends AbstractStringBuilderElement {
  type: "FUNCTION";
  value: string;
  childrenId: string;
  children: StringBuilderElement[];
}

interface Text extends AbstractStringBuilderElement {
  type: "TEXT";
  value: string;
}

interface AlIterator extends AbstractStringBuilderElement {
  type: "AL_ITERATOR";
}

interface GlIterator extends AbstractStringBuilderElement {
  type: "AL_ITERATOR";
}

export type StringBuilderElement = Placeholder | OptionalPlaceholder | Function | Text;
