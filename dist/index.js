import Emitter from '/@lib/emitterjs';
export class TransitionEvent {
    constructor(type, state) {
        this.type = type;
        this.state = state;
    }
}
class FSM {
    constructor(scheme, initialPointer, state) {
        this.emitter = new Emitter;
        this.scheme = scheme;
        this.pointer = initialPointer;
        this.state = state;
    }
    get isActive() {
        return this.pointer in this.scheme;
    }
    dispatch(event) {
        if (this.isActive) {
            const transitions = this.scheme[this.pointer];
            if (transitions) {
                const transition = transitions.find((transition) => transition.if(event, this.state));
                if (transition) {
                    if (transition.to)
                        this.pointer = transition.to;
                    if (transition.update)
                        transition.update(event, this.state);
                    // Emit update
                    this.emitter.emit(new TransitionEvent(this.pointer, this.state));
                }
            }
        }
        else
            this.emitter.events.forEach(this.emitter.offAll.bind(this.emitter));
    }
    on(pointer, listener) {
        return this.emitter.on(pointer, listener);
    }
    off(pointer, listener) {
        return this.emitter.off(pointer, listener);
    }
}
export default FSM;
