import { IEventEmitter } from './events';

// Базовые типы для работы с DOM
export type HTMLElementTag = keyof HTMLElementTagNameMap;
export type HTMLElementType<T extends HTMLElementTag> = HTMLElementTagNameMap[T];

// Типы для атрибутов
export type ElementAttributes = Record<string, string>;

// Типы для событий
export type EventCallback<T = unknown> = (data: T) => void;

// Типы для моделей
export interface IModel<T> {
  data: T;
  update(data: Partial<T>): void;
  reset(): void;
}

// Типы для презентеров
export interface IPresenter {
  initialize(): void;
  destroy(): void;
}

export interface IPresenterConstructor {
  new (eventEmitter: IEventEmitter): IPresenter;
}

// Типы для компонентов
export interface IComponent {
  element: HTMLElement;
  render(): void;
  destroy(): void;
}

export interface IComponentConstructor {
  new (): IComponent;
}

// Типы для сервисов
export interface IService {
  initialize(): void;
  destroy(): void;
}

export interface IServiceConstructor {
  new (): IService;
} 