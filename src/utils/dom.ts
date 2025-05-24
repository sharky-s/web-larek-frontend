export class DOMUtils {
  private static cache = new Map<string, HTMLElement>();
  
  static getElement(selector: string): HTMLElement {
    if (this.cache.has(selector)) {
      return this.cache.get(selector)!;
    }
    
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    
    this.cache.set(selector, element);
    return element;
  }
  
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    attributes: Record<string, string> = {}
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    
    if (className) {
      element.className = className;
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    return element;
  }
  
  static clearCache(): void {
    this.cache.clear();
  }
} 