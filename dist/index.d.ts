import Emitter, { Signal, IReceiver } from '/@lib/signaljs';
export declare type Pointer = number | string | symbol;
export interface IEvent {
    type: Signal;
}
export interface IDispatcher<E extends IEvent> {
    dispatch(event: E): this;
}
export interface IAsyncDispatcher<E extends IEvent> {
    dispatchAsync(event: E): Promise<this>;
}
export declare type Transition<P extends Pointer, S = undefined, E extends IEvent = IEvent> = {
    to: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => void;
};
export declare type Scheme<P extends Pointer, S = undefined, E extends IEvent = IEvent> = {
    [p in P]?: Transition<P, S, E>[];
};
export declare type SignalStateMap<P extends Pointer, S = undefined> = {
    [p in P]: [state: S];
};
export interface IFSM<P extends Pointer, S = undefined, E extends IEvent = IEvent> extends IDispatcher<E>, IAsyncDispatcher<E>, IReceiver<SignalStateMap<P, S>> {
    readonly scheme: Scheme<P, S, E>;
    readonly isActive: boolean;
}
declare class FSM<P extends Pointer, S = undefined, E extends IEvent = IEvent> implements IFSM<P, S, E> {
    protected emitter: Emitter<SignalStateMap<P, S>>;
    protected state: S;
    protected pointer: P;
    scheme: Scheme<P, S, E>;
    constructor(scheme: Scheme<P, S, E>, initialPointer: P, state: S);
    get isActive(): boolean;
    dispatch(event: E): this;
    dispatchAsync(event: E): Promise<this>;
    on<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any): this;
    once<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any): this;
    off<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any): this;
}
export default FSM;
