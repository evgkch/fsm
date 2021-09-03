import { IEvent, IReceiver, Listener } from '/@lib/emitterjs';
export declare type Pointer = number | string | symbol;
interface IDispatcher {
    dispatch(event: IEvent): any;
}
export declare type Transition<P extends Pointer, E extends IEvent, S> = {
    to?: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => any;
};
export declare type Scheme<P extends Pointer, E extends IEvent, S> = {
    [key in P]?: Transition<P, E, S>[];
};
export declare class TransitionEvent<P extends Pointer, S> implements IEvent {
    readonly type: P;
    readonly state: S;
    constructor(type: P, state: S);
}
export interface IFSM<P extends Pointer, E extends IEvent, S> extends IDispatcher, IReceiver<TransitionEvent<P, S>> {
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
    dispatch(event: E): void;
    on<K extends TransitionEvent<P, S>>(pointer: K['type'], listener: Listener<K>): boolean;
    off<K extends TransitionEvent<P, S>>(pointer: K['type'], listener: Listener<K>): boolean;
}
export default FSM;
