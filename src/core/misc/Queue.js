export default class Queue extends Array {
    constructor(queueLength) {
        super();
        this.queueLength = queueLength;
    }
    push(...items) {
        super.push(...items);
        if (this.length > this.queueLength) {
            this.splice(0, this.length - this.queueLength);
        }
        return this.length;
    }
}
