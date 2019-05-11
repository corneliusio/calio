import format from './format';

class LilEpoch {

    constructor(...args) {
        const [ a, b, c ] = args;

        if (args.length > 1) {
            this.value = new Date(a, b, c || 1);
        } else if (a instanceof LilEpoch) {
            this.value = a.clone().value;
        } else if (a instanceof Date) {
            this.value = a;
        } else if ([ 'number', 'string' ].includes(typeof a)) {
            this.value = new Date(a);
        } else {
            this.value = new Date();
        }

        this.value.setUTCHours(0);
        this.value.setUTCMinutes(0);
        this.value.setUTCSeconds(0);
        this.value.setUTCMilliseconds(0);
    }

    year(y = null) {

        if (y !== null) {
            this.value.setUTCFullYear(y);

            return this;
        }

        return this.value.getUTCFullYear();
    }

    month(m = null) {

        if (m !== null) {
            this.value.setUTCMonth(m);

            return this;
        }

        return this.value.getUTCMonth();
    }

    date(d = null) {

        if (d !== null) {
            this.value.setUTCDate(d);

            return this;
        }

        return this.value.getUTCDate();
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
        return this.value.getUTCDay();
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
        return format(this.timestamp(), mask, true);
    }

    clone() {
        return new LilEpoch(this.timestamp());
    }

    toString() {
        return this.value.toString();
    }
}

export default LilEpoch;
