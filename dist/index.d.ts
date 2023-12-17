import { Rx } from 'channeljs';
export type Maybe<T> = T | void;
export type State<P, C> = [P, C];
export type StatePointer<S> = S extends State<infer P, any> ? P : never;
export type StateContent<S> = S extends State<any, infer C> ? C : never;
export interface Event {
    type: any;
}
export type Transition<S> = S extends State<infer SP, infer SC> ? [
    from: SP,
    [
        to: SP,
        <E extends Event>(event: E, state: Readonly<SC>) => Maybe<SC>
    ]
] : never;
export default class StateMachine<S extends State<any, any>> {
    #private;
    constructor(transitions: Transition<S>[], state: S);
    get pointer(): any;
    get content(): any;
    get active(): boolean;
    get rx(): Rx<[message: StatePointer<S>, args: [from: StatePointer<S>, event: Event]][]>;
    dispatch(event: Event): boolean;
    dispatch_async(event: Event): Promise<boolean>;
    clear(): void;
}
