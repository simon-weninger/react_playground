import { generateId } from "../utils";

export class AbstractElement {
  protected id: string;
  protected label: string;

  constructor(label: string) {
    this.id = generateId();
    this.label = label;
  }

  getId() {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getLabel() {
    return this.label;
  }

  forEachRecursive(cb: (e: AbstractElement) => void) {
    cb(this);
  }

  cloneDeep(): AbstractElement {
    throw new Error("You have to implement the method!");
  }
}

export class TextElement extends AbstractElement {
  private value: string;

  constructor(value: string) {
    super(value);
    this.value = value;
  }

  public getValue() {
    return this.value;
  }

  public setValue(newValue: string) {
    this.value = newValue;
    this.label = newValue;
  }

  cloneDeep() {
    const clone = new TextElement(this.value);
    clone.setId(this.id);
    return clone;
  }
}

export class PlaceholderElement extends AbstractElement {
  protected placeholder: Placeholder;

  constructor(placeholder: Placeholder) {
    super(placeholder.label);
    this.placeholder = placeholder;
  }

  public changePlaceholder(placeholder: Placeholder) {
    this.placeholder = placeholder;
    this.label = placeholder.label;
  }

  cloneDeep() {
    const clone = new PlaceholderElement(this.placeholder);
    clone.setId(this.id);
    return clone;
  }
}

export class OptionalPlaceholderElement extends PlaceholderElement {
  private stringBefore: string;
  private stringAfter: string;

  constructor(placeholder: Placeholder) {
    super(placeholder);
    this.stringBefore = "";
    this.stringAfter = "";
  }

  public setStringBefore(str: string) {
    this.stringBefore = str;
  }

  public getStringBefore() {
    return this.stringBefore;
  }

  public setStringAfter(str: string) {
    this.stringAfter = str;
  }

  public getStringAfter() {
    return this.stringAfter;
  }

  cloneDeep() {
    const clone = new OptionalPlaceholderElement(this.placeholder);
    clone.setStringBefore(this.stringBefore);
    clone.setStringAfter(this.stringAfter);
    clone.setId(this.id);
    return clone;
  }
}

export class FunctionElement extends AbstractElement {
  private childrenId: string;
  private children: StringBuilderElement[];
  private functionId: string;

  constructor(functionId: string, functionLabel: string) {
    super(functionLabel);
    this.functionId = functionId;
    this.childrenId = generateId();
    this.children = [];
  }

  changeFunction(functionId: string, functionLabel: string) {
    this.functionId = functionId;
    this.label = functionLabel;
  }

  getChildrenId() {
    return this.childrenId;
  }

  getChildren() {
    return this.children;
  }

  setChildren(newChildren: StringBuilderElement[]) {
    this.children = newChildren;
  }

  getFunctionId() {
    return this.functionId;
  }

  setChildrenId(childrenId: string) {
    this.childrenId = childrenId;
  }

  forEachRecursive(cb: (e: AbstractElement) => void): void {
    cb(this);
    this.children.forEach((element) => {
      cb(element);
    });
  }

  cloneDeep() {
    const clone = new FunctionElement(this.functionId, this.label);
    clone.setId(this.id);
    clone.setChildrenId(this.childrenId);
    const newChildren = this.children.map((child) => child.cloneDeep());
    clone.setChildren(newChildren);
    return clone;
  }
}

export type StringBuilderElement = TextElement | PlaceholderElement | OptionalPlaceholderElement | FunctionElement;

export abstract class AbstractPlaceholder {
  public id: string;
  public label: string;
  public group: string;
  public value: string;

  constructor(id: string, label: string, group: string, value: string) {
    this.id = id;
    this.label = label;
    this.group = group;
    this.value = value;
  }
}

export class SimplePlaceholder extends AbstractPlaceholder {}

export class GuiListPlaceholder extends AbstractPlaceholder {
  public guiListProps: string;
  constructor(id: string, label: string, group: string, value: string) {
    super(id, label, group, value);
    this.guiListProps = "";
  }
}

export class ArrayListPlaceholder extends AbstractPlaceholder {
  public arrayListProps: string;
  constructor(id: string, label: string, group: string, value: string) {
    super(id, label, group, value);
    this.arrayListProps = "";
  }
}

export type Placeholder = SimplePlaceholder | GuiListPlaceholder | ArrayListPlaceholder;
