
export class Deferred extends Promise {

    constructor(resolve, reject) {
        super(function () {
            resolve = arguments[0];
            reject = arguments[1];
        });
        this.resolve = resolve;
        this.reject = reject;
    }
}
