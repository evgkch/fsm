import { Signal, IReceiver } from '/@lib/signaljs';
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
export declare type Transition<P extends Pointer, E extends IEvent, S> = {
    to: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => void;
};
export declare type Scheme<P extends Pointer, E extends IEvent, S> = {
    [p in P]?: Transition<P, E, S>[];
};
export declare type SignalStateMap<P extends Pointer, S> = {
    [p in P]: [state: S];
};
export declare class TransitionEvent<P extends Pointer, S> implements IEvent {
    readonly type: P;
    readonly state: S;
    constructor(type: P, state: S);
}
export interface IFSM<P extends Pointer, E extends IEvent, S> extends IDispatcher<E>, IAsyncDispatcher<E>, IReceiver<SignalStateMap<P, S>> {
    readonly scheme: Scheme<P, E, S>;
    readonly isActive: boolean;
}
declare class FSM<P extends Pointer, E extends IEvent, S> implements IFSM<P, E, S> {
    private emitter;
    private state;
    private pointer;
    scheme: Scheme<P, E, S>;
    constructor(scheme: Scheme<P, E, S>, initialPointer: P, state: S);
    get isActive(): boolean;
    dispatch(event: E): this;
    dispatchAsync(event: E): Promise<this>;
    on<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any): this;
    once<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any): this;
    off<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any): this;
}
export default FSM;
