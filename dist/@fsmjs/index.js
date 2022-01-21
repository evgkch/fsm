var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FSM_emitter, _FSM_state, _FSM_pointer, _FSM_scheme;
import Emitter from '/@signaljs';
class FSM {
    constructor(scheme, initialPointer, state) {
        _FSM_emitter.set(this, new Emitter);
        _FSM_state.set(this, void 0);
        _FSM_pointer.set(this, void 0);
        _FSM_scheme.set(this, void 0);
        __classPrivateFieldSet(this, _FSM_scheme, scheme, "f");
        __classPrivateFieldSet(this, _FSM_pointer, initialPointer, "f");
        __classPrivateFieldSet(this, _FSM_state, state, "f");
    }
    get pointer() {
        return __classPrivateFieldGet(this, _FSM_pointer, "f");
    }
    ;
    get isActive() {
        return __classPrivateFieldGet(this, _FSM_pointer, "f") in __classPrivateFieldGet(this, _FSM_scheme, "f");
    }
    set maxListeners(n) {
        __classPrivateFieldGet(this, _FSM_emitter, "f").maxListeners = n;
    }
    get maxListeners() {
        return __classPrivateFieldGet(this, _FSM_emitter, "f").maxListeners;
    }
    dispatch(event) {
        if (this.isActive) {
            const transitions = __classPrivateFieldGet(this, _FSM_scheme, "f")[__classPrivateFieldGet(this, _FSM_pointer, "f")];
            if (transitions) {
                const transition = transitions.find(transition => transition.if(event, __classPrivateFieldGet(this, _FSM_state, "f")));
                if (transition) {
                    __classPrivateFieldSet(this, _FSM_pointer, transition.to, "f");
                    if (transition.update)
                        transition.update(event, __classPrivateFieldGet(this, _FSM_state, "f"));
                    // Emit update
                    __classPrivateFieldGet(this, _FSM_emitter, "f").emit(this.pointer, __classPrivateFieldGet(this, _FSM_state, "f"));
                    return true;
                }
            }
        }
        else
            __classPrivateFieldGet(this, _FSM_emitter, "f").offGlobal();
        return false;
    }
    dispatchAsync(event) {
        return new Promise(resolve => setTimeout(() => resolve(this.dispatch(event)), 0));
    }
    on(pointer, listener) {
        __classPrivateFieldGet(this, _FSM_emitter, "f").on(pointer, listener);
        return this;
    }
    once(pointer, listener) {
        __classPrivateFieldGet(this, _FSM_emitter, "f").once(pointer, listener);
        return this;
    }
    off(pointer, listener) {
        __classPrivateFieldGet(this, _FSM_emitter, "f").off(pointer, listener);
        return this;
    }
}
_FSM_emitter = new WeakMap(), _FSM_state = new WeakMap(), _FSM_pointer = new WeakMap(), _FSM_scheme = new WeakMap();
export default FSM;
