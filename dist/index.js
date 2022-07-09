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
var _Dx_pointer, _Dx_state, _Dx_scheme, _Dx_tx;
import { channel } from '/channeljs';
export function fsm(scheme, pointer, state) {
    const { tx, rx, ch } = channel();
    return {
        ch,
        rx,
        dx: new Dx(scheme, pointer, state, tx)
    };
}
export class Dx {
    constructor(scheme, pointer, state, tx) {
        _Dx_pointer.set(this, void 0);
        _Dx_state.set(this, void 0);
        _Dx_scheme.set(this, void 0);
        _Dx_tx.set(this, void 0);
        __classPrivateFieldSet(this, _Dx_scheme, scheme, "f");
        __classPrivateFieldSet(this, _Dx_pointer, pointer, "f");
        __classPrivateFieldSet(this, _Dx_state, state, "f");
        __classPrivateFieldSet(this, _Dx_tx, tx, "f");
    }
    get pointer() {
        return __classPrivateFieldGet(this, _Dx_pointer, "f");
    }
    get is_active() {
        return __classPrivateFieldGet(this, _Dx_pointer, "f") in __classPrivateFieldGet(this, _Dx_scheme, "f");
    }
    dispatch(event) {
        if (this.is_active) {
            const ts = __classPrivateFieldGet(this, _Dx_scheme, "f")[__classPrivateFieldGet(this, _Dx_pointer, "f")];
            if (ts) {
                const t = ts.find(t => t.if(event, __classPrivateFieldGet(this, _Dx_state, "f")));
                if (t) {
                    __classPrivateFieldSet(this, _Dx_pointer, t.to, "f");
                    if (t.update) {
                        t.update(event, __classPrivateFieldGet(this, _Dx_state, "f"));
                    }
                    __classPrivateFieldGet(this, _Dx_tx, "f").send(this.pointer, event, __classPrivateFieldGet(this, _Dx_state, "f"));
                    return true;
                }
            }
        }
        return false;
    }
    dispatch_async(event) {
        return new Promise(resolve => setTimeout(() => resolve(this.dispatch(event)), 0));
    }
}
_Dx_pointer = new WeakMap(), _Dx_state = new WeakMap(), _Dx_scheme = new WeakMap(), _Dx_tx = new WeakMap();
