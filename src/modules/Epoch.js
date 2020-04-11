import format from './format';

class Epoch {
    constructor(...args) {
        const [ Y, M, D, h, m, s ] = args;

        if (args.length > 1) {
            this.value = new Date(Y, M, D || 1, h || 0, m || 0, s || 0);
        } else if (Y instanceof Epoch) {
            this.value = Y.clone().value;
        } else if (Y instanceof Date) {
            this.value = Y;
        } else if ([ 'number', 'string' ].includes(typeof Y)) {
            this.value = new Date(Y);
        } else {
            this.value = new Date();
        }

        if (typeof Y === 'string') {
            this.value.setHours(
                this.value.getHours() + (this.value.getTimezoneOffset() / 60)
            );
        }

        this.value.setSeconds(0);
        this.value.setMilliseconds(0);
    }

    year(y = null) {
        if (y !== null) {
            this.value.setFullYear(y);

            return this;
        }

        return this.value.getFullYear();
    }

    month(m = null) {
        if (m !== null) {
            this.value.setMonth(m);

            return this;
        }

        return this.value.getMonth();
    }

    date(d = null) {
        if (d !== null) {
            this.value.setDate(d);

            return this;
        }

        return this.value.getDate();
    }

    addDay(d = 1) {
        this.date(this.date() + d);

        return this;
    }

    addMonth(m = 1) {
        this.month(this.month() + m);

        return this;
    }

    addYear(y = 1) {
        this.year(this.year() + y);

        return this;
    }

    subDay(d = 1) {
        this.date(this.date() - d);

        return this;
    }

    subMonth(m = 1) {
        this.month(this.month() - m);

        return this;
    }

    subYear(y = 1) {
        this.year(this.year() - y);

        return this;
    }

    dayOfWeek() {
        return this.value.getDay();
    }

    endOfMonth() {
        this.addMonth();
        this.date(0);

        return this;
    }

    startOfMonth() {
        this.date(1);

        return this;
    }

    isAfter(day) {
        return this.value > day.value;
    }

    isBefore(day) {
        return this.value < day.value;
    }

    isSame(day) {
        return this.year() === day.year()
            && this.month() === day.month()
            && this.date() === day.date();
    }

    isBetween(day1, day2) {
        return (this.isAfter(day1) && this.isBefore(day2))
            || (this.isAfter(day2) && this.isBefore(day1));
    }

    isSameMonth(day) {
        return this.year() === day.year()
            && this.month() === day.month();
    }

    isSameYear(day) {
        return this.year() === day.year();
    }

    timestamp() {
        return this.value.getTime();
    }

    format(mask) {
        return format(this.value, mask, true);
    }

    clone() {
        return new Epoch(this.timestamp());
    }

    toString() {
        return this.value.toString();
    }

    get length() {
        return this.value ? 1 : 0;
    }
}

export default Epoch;
