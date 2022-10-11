export abstract class EventBus {
  abstract emit(event: string, ...payload: any[]);
  abstract emitAsync(event: string, ...payload: any[]);
}
