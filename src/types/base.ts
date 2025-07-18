import { EventPayloads } from './events';

/**
 * Базовый интерфейс EventEmitter-а с типизацией по EventPayloads
 */
export interface IEventEmitter {
  /**
   * Подписаться на событие
   */
  on<K extends keyof EventPayloads>(
    event: K,
    listener: (...args: EventPayloads[K]) => void
  ): void;

  /**
   * Отписаться от события
   */
  off<K extends keyof EventPayloads>(
    event: K,
    listener: (...args: EventPayloads[K]) => void
  ): void;

  /**
   * Опубликовать событие
   */
  emit<K extends keyof EventPayloads>(
    event: K,
    ...args: EventPayloads[K]
  ): void;
}