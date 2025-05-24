import { DOMUtils } from '../../utils/dom';

export interface IComponent {
  element: HTMLElement;
  render(): void;
  destroy(): void;
}

export abstract class Component implements IComponent {
  public element: HTMLElement;
  protected elements: Map<string, HTMLElement> = new Map();
  
  constructor() {
    this.element = DOMUtils.createElement('div');
  }
  
  protected getElement(selector: string): HTMLElement {
    if (this.elements.has(selector)) {
      return this.elements.get(selector)!;
    }
    
    const element = this.element.querySelector(selector) as HTMLElement;
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    
    this.elements.set(selector, element);
    return element;
  }
  
  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    attributes: Record<string, string> = {}
  ): HTMLElementTagNameMap[K] {
    return DOMUtils.createElement(tag, className, attributes);
  }
  
  abstract render(): void;
  
  destroy(): void {
    this.elements.clear();
    this.element.remove();
  }
} 