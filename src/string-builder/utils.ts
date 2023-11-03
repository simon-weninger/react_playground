import { PixelBuilderElement } from "./obj-impl/types";

export const generateId = () => Math.random().toString(36).slice(2);

export function isDeeplyNested(activeElement: HTMLElement | null, containerElement: HTMLElement | null): boolean {
  function isNested(element: HTMLElement | null, container: HTMLElement | null): boolean {
    if (!element || !container) {
      return false;
    }

    if (element === container) {
      return true;
    } else if (element.parentNode) {
      return isNested(element.parentNode as HTMLElement, container);
    }

    return false;
  }

  if (activeElement && containerElement) {
    return isNested(activeElement, containerElement);
  }

  return false;
}
