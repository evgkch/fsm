export class Logger {
    constructor(fsm, log) {
        this.fsm = fsm;
        this.log = log;
        this.pointers = new Set;
        for (let pointer in this.fsm.scheme) {
            this.pointers.add(pointer);
            this.fsm.scheme[pointer]?.forEach(t => {
                if (t.to)
                    this.pointers.add(t.to);
            });
        }
        this.pointers.forEach(pointer => this.fsm.on(pointer, this.log.bind(this)));
    }
    terminate() {
        this.pointers.forEach(pointer => this.fsm.off(pointer, this.log.bind(this)));
    }
}
