import { generateId } from "./utils";
import { StringBuilderElement } from "./types";
import {
  FunctionElement,
  OptionalPlaceholderElement,
  PlaceholderElement,
  SimplePlaceholder,
  StringBuilderElement as StringBuilderElementNew,
  TextElement,
} from "./classes/AbstractElement";

export const generateArray = (): StringBuilderElement[] => {
  let array: StringBuilderElement[] = [];
  for (let i = 0; i < 100; i++) {
    array = array.concat([
      {
        id: generateId(),
        label: "Text",
        type: "TEXT",
        value: "Text",
      },
      {
        id: generateId(),
        label: "Placeholder",
        type: "PLACEHOLDER",
        placeholderId: "PH1",
      },
      {
        id: generateId(),
        label: "Placeholder",
        type: "OPTIONAL_PLACEHOLDER",
        placeholderId: "PH2",
        stringBefore: '"before":"',
        stringAfter: '",',
      },
      {
        id: generateId(),

        label: "Function",
        type: "FUNCTION",
        value: "SUM",
        childrenId: generateId(),
        children: [
          {
            id: generateId(),
            label: "Text",
            type: "TEXT",
            value: "Text",
          },
        ],
      },
    ]);
  }
  return array;
};

export const generateArrayNew = (): StringBuilderElementNew[] => {
  let array: StringBuilderElementNew[] = [];
  // for (let i = 0; i < 100; i++) {
  array = array.concat([
    new TextElement("text"),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Location Href", "Group1", "{{location_href}}")),
    new OptionalPlaceholderElement(new SimplePlaceholder(generateId(), "Location Href", "Group1", "{{location_href}}")),
    new FunctionElement(generateId(), "MD5"),
  ]);
  // }
  return array;
};
