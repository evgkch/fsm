import { Tx, Rx, Message } from '/channeljs';
export declare type Pointer = number | string | symbol;
export interface IEvent {
    type: Message;
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
    [p in P]: [event: E, state: S];
};
export declare class Dx<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {
    #private;
    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S, tx: Tx<PointerMap<P>>);
    get pointer(): P;
    get active(): boolean;
    dispatch(event: E): boolean;
    dispatch_async(event: E): Promise<boolean>;
}
export default class FSM<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {
    #private;
    readonly rx: Rx<PointerMap<P, E, S>>;
    readonly dx: Dx<P, E, S>;
    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S);
    /**
     * Getting all subscribtion pointers, that have at least one listener
     */
    get pointers(): IterableIterator<P>;
    /**
     * Clear all subsribers
     */
    clear(): void;
}
