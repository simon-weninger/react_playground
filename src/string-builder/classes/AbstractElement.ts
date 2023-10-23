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

  forEachRecursive(cb: (e: StringBuilderElement) => void) {
    throw new Error("You have to implement the method!");
  }

  cloneDeep(): AbstractElement {
    throw new Error("You have to implement the method!");
  }
}

export class TextElement extends AbstractElement {
  private value: string;
  private color?: string;

  constructor(value: string, color?: string) {
    super(value);
    this.value = value;
    this.color = color;
  }

  public getValue() {
    return this.value;
  }

  public setValue(newValue: string) {
    this.value = newValue;
    this.label = newValue;
  }

  public getColor() {
    return this.color;
  }

  public setColor(color: string) {
    this.color = color;
  }

  forEachRecursive(cb: (e: StringBuilderElement) => void) {
    cb(this);
  }

  cloneDeep() {
    const clone = new TextElement(this.value, this.color);
    clone.setId(this.id);
    return clone;
  }
}

export class PlaceholderElement extends AbstractElement {
  private placeholder: Placeholder;
  private stringBefore: string;
  private stringAfter: string;
  private optional: boolean;

  constructor(placeholder: Placeholder, optional: boolean, stringBefore?: string, stringAfter?: string) {
    super(placeholder.label);
    this.placeholder = placeholder;
    this.optional = optional || false;
    this.stringBefore = stringBefore || "";
    this.stringAfter = stringAfter || "";
  }

  public setPlaceholder(placeholder: Placeholder) {
    this.placeholder = placeholder;
    this.label = placeholder.label;
  }

  public setOptional(optional: boolean) {
    this.optional = optional;
  }

  public getOptional() {
    return this.optional;
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

  forEachRecursive(cb: (e: StringBuilderElement) => void) {
    cb(this);
  }

  cloneDeep() {
    const clone = new PlaceholderElement(this.placeholder, this.optional, this.stringBefore, this.stringAfter);
    clone.setId(this.id);
    return clone;
  }
}

export class FunctionElement extends AbstractElement {
  private childrenId: string;
  private children: StringBuilderElement[];
  private functionId: string;

  constructor(functionId: string, functionLabel: string, children?: StringBuilderElement[]) {
    super(functionLabel);
    this.functionId = functionId;
    this.childrenId = generateId();
    this.children = children || [];
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

  forEachRecursive(cb: (e: StringBuilderElement) => void): void {
    cb(this);
    this.children.forEach((element) => {
      cb(element);
    });
  }

  cloneDeep(): FunctionElement {
    const clonedChildren = this.children.map((child) => child.cloneDeep());
    const clone = new FunctionElement(this.functionId, this.label, clonedChildren);
    clone.setId(this.id);
    clone.setChildrenId(this.childrenId);
    return clone;
  }
}

export class ContentBlock extends AbstractElement {
  private childrenId: string;
  private children: StringBuilderElement[];
  private color?: string;

  constructor(contentLabel: string, children?: StringBuilderElement[], color?: string) {
    super(contentLabel);
    this.childrenId = generateId();
    this.children = children || [];
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  setColor(color: string) {
    this.color = color;
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

  setChildrenId(childrenId: string) {
    this.childrenId = childrenId;
  }

  forEachRecursive(cb: (e: StringBuilderElement) => void): void {
    cb(this);
    this.children.forEach((element) => {
      cb(element);
    });
  }

  cloneDeep(): ContentBlock {
    const clonedChildren = this.children.map((child) => child.cloneDeep());
    const clone = new ContentBlock(this.label, clonedChildren, this.color);
    clone.setId(this.id);
    clone.setChildrenId(this.childrenId);
    return clone;
  }
}

export type RecursiveElement = ContentBlock | FunctionElement;

export type StringBuilderElement = TextElement | PlaceholderElement | RecursiveElement;

export const isRecursiveElement = (element: StringBuilderElement): element is RecursiveElement => {
  if (element instanceof FunctionElement) return true;
  if (element instanceof ContentBlock) return true;
  return false;
};

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
