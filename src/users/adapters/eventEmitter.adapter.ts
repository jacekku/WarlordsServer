import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBus } from '@Users/domain/ports/event/eventBus.port';

@Injectable()
export class EventEmitterBus implements EventBus {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  emit(event: string, payload: any[]) {
    this.eventEmitter.emit(event, payload);
  }
  emitAsync(event: string, payload: any[]) {
    this.eventEmitter.emitAsync(event, payload);
  }
}
