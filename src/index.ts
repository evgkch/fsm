import Emitter, { Signal, IReceiver } from '/emitterjs';

export type Pointer = number | string | symbol;

export interface IEvent {
    type: Signal
}

export interface IDispatcher<E extends IEvent> {
    dispatch(event: E): boolean;
}

export interface IAsyncDispatcher<E extends IEvent> {
    dispatchAsync(event: E): Promise<boolean>;
}

export type Transition<P extends Pointer, S = undefined, E extends IEvent = IEvent> = {
    to: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => void;
};

export type Scheme<P extends Pointer, S = undefined, E extends IEvent = IEvent> = {
    [p in P]?: Transition<P, S, E>[];
};

export type StateSignalMap<P extends Pointer, S = undefined> = {
    [p in P]: [state: S]
}

export interface IFSM<P extends Pointer, S = undefined, E extends IEvent = IEvent> extends IDispatcher<E>, IAsyncDispatcher<E>, IReceiver<StateSignalMap<P, S>> {
    readonly isActive: boolean;
    readonly pointer: P;
    readonly state: S;
    maxListeners: number;
}

class FSM<P extends Pointer, S = undefined, E extends IEvent = IEvent> implements IFSM<P, S, E> {

    #emitter: Emitter<StateSignalMap<P, S>> = new Emitter;
    #state: S;
    #pointer: P;
    #scheme: Scheme<P, S, E>;

    constructor(scheme: Scheme<P, S, E>, initialPointer: P, state: S) {
        this.#scheme = scheme;
        this.#pointer = initialPointer;
        this.#state = state;
    }

    get pointer() {
        return this.#pointer;
    }

    get state() {
        return this.#state;
    }

    get isActive(): boolean {
        return this.#pointer in this.#scheme;
    }

    set maxListeners(n: number) {
        this.#emitter.maxListeners = n;
    }

    get maxListeners() {
        return this.#emitter.maxListeners;
    }

    dispatch(event: E): boolean {
        if (this.isActive)
        {
            const transitions = this.#scheme[this.#pointer];
            if (transitions)
            {
                const transition = transitions.find(transition =>
                    transition.if(event, this.#state)
                );
                if (transition)
                {
                    this.#pointer = transition.to;
                    if (transition.update)
                        transition.update(event, this.#state);
                    // Emit update
                    this.#emitter.emit(this.pointer, this.#state);
                    return true;
                }
            }
        }
        else
            this.#emitter.offGlobal();

        return false;
    }

    dispatchAsync(event: E): Promise<boolean> {
        return new Promise(resolve =>
            setTimeout(() => resolve(this.dispatch(event)), 0)
        );
    }

    on<K extends P>(pointer: K, listener: (...args: StateSignalMap<K, S>[K]) => any) {
        this.#emitter.on(pointer, listener);
        return this;
    }

    once<K extends P>(pointer: K, listener: (...args: StateSignalMap<K, S>[K]) => any) {
        this.#emitter.once(pointer, listener);
        return this;
    }

    off<K extends P>(pointer: K, listener: (...args: StateSignalMap<K, S>[K]) => any) {
        this.#emitter.off(pointer, listener);
        return this;
    }
}

export default FSM;