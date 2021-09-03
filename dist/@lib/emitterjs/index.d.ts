export interface IEvent {
    type: string | number | symbol;
}
export declare type Listener<E extends IEvent> = (event: E) => void;
export interface IReceiver<E extends IEvent> {
    on<K extends E>(type: K['type'], listener: Listener<K>): boolean;
    off<K extends E>(type: K['type'], listener: Listener<K>): boolean;
}
export interface ITransmitter<E extends IEvent> {
    emit(event: E): boolean;
}
export interface IEmitter<E extends IEvent> extends IReceiver<E>, ITransmitter<E> {
    readonly events: E['type'][];
    offAll(type: E['type']): boolean;
}
declare class Emitter<E extends IEvent> implements IEmitter<E> {
    private listeners;
    get events(): E['type'][];
    on<S extends E>(type: S['type'], listener: Listener<S>): boolean;
    off<S extends E>(type: S['type'], listener: Listener<S>): boolean;
    offAll(type: E['type']): boolean;
    emit(event: E): boolean;
}
export default Emitter;
