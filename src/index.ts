import Channel, { Rx, Tx, Subscribers } from 'channeljs';

export type Maybe<T> = T | void;

export type State<P, C> = [P, C];

export type StatePointer<S> = S extends State<infer P, any> ? P : never;

export type StateContent<S> = S extends State<any, infer C> ? C : never;

export interface Event { type: any }

export type Transition<S> =
    S extends State<infer SP, infer SC>
    ? [
        from: SP,
        [to: SP, <E extends Event>(event: E, state: Readonly<SC>) => Maybe<SC>]
    ]
    : never;

export default class StateMachine<S extends State<any, any>> {
    
    #channel = new Channel<[
        message: StatePointer<S>,
        args: [
            from: StatePointer<S>,
            event: Event
        ]
    ][]>;
    #scheme: Map<Transition<S>[0], Transition<S>[1][]> = new Map;
    #state: S;

    constructor(transitions: Transition<S>[], state: S) {
        for (const transition of transitions) {
            if (!this.#scheme.has(transition[0])) {
                this.#scheme.set(transition[0], []);
            }
            this.#scheme.get(transition[0])!.push(transition[1]);
        }
        this.#state = state;
    }

    get pointer() {
        return this.#state[0];
    }

    get content() {
        return this.#state[1];
    }

    get active(): boolean {
        return this.#scheme.has(this.#state[this.pointer]);
    }

    get rx() {
        return this.#channel.rx;
    }

    dispatch(event: Event): boolean {
        if (this.active) {
            const from = this.#state[this.pointer];
            if (this.#scheme.has(from)) {
                const transitions = this.#scheme.get(from)!;
                for (const transition of transitions) {
                    const content = transition[1](event, this.content) as Maybe<StateContent<S>>;
                    if (content !== undefined) {
                        this.#state = [transition[0], content] as S;
                        this.#channel.tx.send(transition[0], from, event);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    dispatch_async(event: Event): Promise<boolean> {
        return new Promise(resolve =>
            setTimeout(() => resolve(this.dispatch.call(this, event)), 0)
        );
    }

    clear() {
        return this.#channel.clear();
    }

}

