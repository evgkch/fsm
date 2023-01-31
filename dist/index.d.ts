import { Rx, Message, Subscribers } from 'channeljs';
export declare type Pointer = Message;
export interface IEvent {
    type: Pointer;
}
export declare type Transition<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> = {
    to: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => void;
};
export declare type Scheme<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> = {
    [p in P]?: Transition<P, E, S>[];
};
export declare type PointerMap<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> = {
    [p in P]: [event: E, state: Readonly<S>];
};
export default class FSM<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {
    #private;
    readonly dx: Dx<P, E, S>;
    readonly rx: Rx<PointerMap<P, E, S>>;
    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S);
    /**
     * Clear all subscribers
     */
    clear(): void;
}
export declare class Dx<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {
    #private;
    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S, subscribers: Subscribers<PointerMap<P, E, S>>);
    get pointer(): P;
    get is_active(): boolean;
    dispatch(event: E): boolean;
    dispatch_async(event: E): Promise<boolean>;
}
