import { Tx, Rx, Message } from '/channeljs';

export type Pointer = number | string | symbol;

export interface IEvent {
    type: Message
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
    [p in P]: [event: E, state: S]
}

export class Dx<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {

    #pointer: P;
    #state: S;
    #scheme: Scheme<P, E, S>;
    #tx: Tx<PointerMap<P>>;

    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S, tx: Tx<PointerMap<P>>) {
        this.#scheme = scheme;
        this.#pointer = pointer;
        this.#state = state;
        this.#tx = tx;
    }

    get pointer() {
        return this.#pointer;
    }

    get active(): boolean {
        return this.#pointer in this.#scheme;
    }

    dispatch(event: E): boolean {
        if (this.active) {
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

export default class FSM<P extends Pointer, E extends IEvent = IEvent, S extends Object = {}> {

    #subscribers: Map<P, Set<(...args: PointerMap<P, E, S>[P]) => any>> = new Map;
    #tx = new Tx(this.#subscribers);
    readonly rx = new Rx(this.#subscribers);
    readonly dx: Dx<P, E, S>;

    constructor(scheme: Scheme<P, E, S>, pointer: P, state: S) {
        this.dx = new Dx(scheme, pointer, state, this.#tx);
    }

    /**
	 * Getting all subscribtion pointers, that have at least one listener
	 */
    get pointers() {
        return this.#subscribers.keys();
    }

    /**
	 * Clear all subsribers
	 */
    clear() {
        this.#subscribers.clear();
    }

}
