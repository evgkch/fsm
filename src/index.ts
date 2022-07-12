import { Rx, Tx, Message, Subscribers } from '/channeljs';

export type Pointer = Message;

export interface IEvent {
    type: Pointer
}

export type Transition<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> = {
    to: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => void;
};

export type Scheme<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> = {
    [p in P]?: Transition<P, E, S>[];
};

export type PointerMap<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> = {
    [p in P]: [event: E, state: Readonly<S>]
}

export default class FSM<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {

    #subscribers: Subscribers<PointerMap<P, E, S>> = new Map;
    readonly dx: Dx<P, E, S>;
    readonly rx: Rx<PointerMap<P, E, S>>;

    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S) {
        this.dx = new Dx(scheme, pointer, state, this.#subscribers);
        this.rx = new Rx(this.#subscribers);
    }

    /**
     * Clear all subscribers
     */
    clear() {
        this.#subscribers.clear();
    }

}

export class Dx<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {

    #pointer: P;
    #state: S;
    #scheme: Scheme<P, E, S>;
    #tx: Tx<PointerMap<P, E, S>>;

    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S, subscribers: Subscribers<PointerMap<P, E, S>>) {
        this.#scheme = scheme;
        this.#pointer = pointer;
        this.#state = state;
        this.#tx = new Tx(subscribers);
    }

    get pointer() {
        return this.#pointer;
    }

    get is_active(): boolean {
        return this.#pointer in this.#scheme;
    }

    dispatch(event: E): boolean {
        if (this.is_active) {
            const ts = this.#scheme[this.#pointer];
            if (ts) {
                const t = ts.find(t => t.if(event, this.#state));
                if (t) {
                    this.#pointer = t.to;
                    if (t.update) {
                        t.update(event, this.#state);
                    }
                    this.#tx.send(this.pointer, event, this.#state);
                    return true;
                }
            }
        }
        return false;
    }

    dispatch_async(event: E): Promise<boolean> {
        return new Promise(resolve =>
            setTimeout(() => resolve(this.dispatch(event)), 0)
        );
    }

}
