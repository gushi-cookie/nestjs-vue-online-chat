export class Range {
    constructor(
        private fromValue: number,
        private toValue: number
    ) { }

    inRange(value: number): boolean {
        if(this.fromValue === this.toValue) return value === this.fromValue;
        return value >= this.fromValue && value <= this.toValue;
    }
}