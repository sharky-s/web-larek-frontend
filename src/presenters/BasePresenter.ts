import { IEventEmitter, EventType } from '../types/events';

export abstract class BasePresenter {
  protected eventEmitter: IEventEmitter;
  
  constructor(eventEmitter: IEventEmitter) {
    this.eventEmitter = eventEmitter;
  }
  
  protected emit<T>(event: EventType, data: T): void {
    this.eventEmitter.emit(event, data);
  }
  
  protected on<T>(event: EventType, callback: (data: T) => void): void {
    this.eventEmitter.on(event, callback);
  }
  
  protected off<T>(event: EventType, callback: (data: T) => void): void {
    this.eventEmitter.off(event, callback);
  }
} 