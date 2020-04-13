import Epoch from '../src/modules/Epoch';

test('accepts year, month, date arguments', () => {
    expect(new Epoch(2018, 0, 1)).toHaveProperty('value', new Date(2018, 0, 1));
});

test('defaults to 1st if on date provided', () => {
    expect(new Epoch(2018, 0)).toHaveProperty('value', new Date(2018, 0, 1));
});

test('accepts another Epoch instance', () => {
    let epoch = new Epoch();

    expect(new Epoch(epoch)).toEqual(epoch);
});

test('accepts a Date object', () => {
    let date = new Date();

    expect(new Epoch(date)).toHaveProperty('value', date);
});

test('accepts a timestamp', () => {
    let timestamp = new Date(2018, 0).getTime();

    expect(new Epoch(timestamp)).toHaveProperty('value', new Date(timestamp));
});

test('accepts a date string', () => {
    let date = new Date(2018, 0, 1);

    date.setSeconds(0);
    date.setMilliseconds(0);

    expect(new Epoch('2018-01-01')).toHaveProperty('value', date);
});

test('resets, seconds, and milliseconds', () => {
    let date = new Date(2018, 0, 1, 12, 7);

    date.setSeconds(0);
    date.setMilliseconds(0);

    expect(new Epoch(2018, 0, 1, 12, 7, 7, 7)).toHaveProperty('value', date);
});

test('normalizes arguments', () => {
    let date = new Date(1988, 10, 25);

    date.setSeconds(0);
    date.setMilliseconds(0);

    expect(new Epoch('1988-11-25')).toHaveProperty('value', date);
    expect(new Epoch(1988, 10, 25)).toHaveProperty('value', date);
    expect(new Epoch([ 1988, 10, 25 ])).toHaveProperty('value', date);
    expect(new Epoch(new Date(1988, 10, 25, 0, 0, 7, 7))).toHaveProperty('value', date);
});

test('gets/set the year', () => {
    let epoch = new Epoch(1988, 10, 25);

    expect(epoch.year()).toBe(1988);

    epoch.year(1992);

    expect(epoch.year()).toBe(1992);
});

test('gets/set the month', () => {
    let epoch = new Epoch(1988, 10, 25);

    expect(epoch.month()).toBe(10);

    epoch.month(5);

    expect(epoch.month()).toBe(5);
});

test('gets/set the date', () => {
    let epoch = new Epoch(1988, 10, 25);

    expect(epoch.date()).toBe(25);

    epoch.date(27);

    expect(epoch.date()).toBe(27);
});

test('can add days', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.addDay();

    expect(epoch.date()).toBe(26);

    epoch.addDay(2);

    expect(epoch.date()).toBe(28);
});

test('can add months', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.addMonth();

    expect(epoch.month()).toBe(11);

    epoch.addMonth(2);

    expect(epoch.month()).toBe(1);
});

test('can add years', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.addYear();

    expect(epoch.year()).toBe(1989);

    epoch.addYear(6);

    expect(epoch.year()).toBe(1995);
});

test('can subtract days', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.subDay();

    expect(epoch.date()).toBe(24);

    epoch.subDay(2);

    expect(epoch.date()).toBe(22);
});

test('can subtract months', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.subMonth();

    expect(epoch.month()).toBe(9);

    epoch.subMonth(2);

    expect(epoch.month()).toBe(7);
});

test('can subtract years', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.subYear();

    expect(epoch.year()).toBe(1987);

    epoch.subYear(6);

    expect(epoch.year()).toBe(1981);
});

test('gets the day of the week', () => {
    let epoch = new Epoch(1988, 10, 25);

    expect(epoch.dayOfWeek()).toBe(5);
});

test('jumps to end of month', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.endOfMonth();

    expect(epoch.month()).toBe(10);
    expect(epoch.date()).toBe(30);
});

test('jumps to start of month', () => {
    let epoch = new Epoch(1988, 10, 25);

    epoch.startOfMonth();

    expect(epoch.month()).toBe(10);
    expect(epoch.date()).toBe(1);
});

test('checks if date is after another date', () => {
    let epoch1 = new Epoch(1988, 10, 25),
        epoch2 = new Epoch(1992, 10, 27);

    expect(epoch1.isAfter(epoch2)).toBe(false);
    expect(epoch2.isAfter(epoch1)).toBe(true);
});

test('checks if date is before another date', () => {
    let epoch1 = new Epoch(1988, 10, 25),
        epoch2 = new Epoch(1992, 10, 27);

    expect(epoch1.isBefore(epoch2)).toBe(true);
    expect(epoch2.isBefore(epoch1)).toBe(false);
});

test('checks if two dates are the same', () => {
    let epoch1 = new Epoch(1988, 10, 25),
        epoch2 = new Epoch(1988, 10, 25),
        epoch3 = new Epoch(1992, 10, 27);

    expect(epoch1.isSame(epoch2)).toBe(true);
    expect(epoch1.isSame(epoch3)).toBe(false);
});

test('checks if date is between two other dates', () => {
    let epoch1 = new Epoch(1988, 10, 25),
        epoch2 = new Epoch(1988, 10, 26),
        epoch3 = new Epoch(1992, 10, 27),
        epoch4 = new Epoch(1992, 10, 28);

    expect(epoch2.isBetween(epoch1, epoch3)).toBe(true);
    expect(epoch4.isBetween(epoch1, epoch3)).toBe(false);
});

test('checks if two dates are in the same month', () => {
    let epoch1 = new Epoch(1988, 10, 23),
        epoch2 = new Epoch(1988, 10, 25),
        epoch3 = new Epoch(1992, 10, 27);

    expect(epoch1.isSameMonth(epoch2)).toBe(true);
    expect(epoch1.isSameMonth(epoch3)).toBe(false);
});

test('checks if two dates are in the same year', () => {
    let epoch1 = new Epoch(1988, 9, 23),
        epoch2 = new Epoch(1988, 10, 25),
        epoch3 = new Epoch(1992, 11, 27);

    expect(epoch1.isSameYear(epoch2)).toBe(true);
    expect(epoch1.isSameYear(epoch3)).toBe(false);
});

test('gets the timestamp', () => {
    let timestamp = new Date(1988, 10, 25).getTime();

    expect(new Epoch(1988, 10, 25).timestamp()).toBe(timestamp);
});

test('gets a string format of the date', () => {
    let epoch = new Epoch(1988, 10, 25);

    expect(epoch.format()).toBe('Fri Nov 25 1988 12:00:00');
});

test('creates a clone date', () => {
    let epoch1 = new Epoch(1988, 10, 25),
        epoch2 = epoch1.clone();

    expect(epoch1).toEqual(epoch2);

    epoch2.year(2018);

    expect(epoch1.year()).toBe(1988);
    expect(epoch2.year()).toBe(2018);
});

test('deferes toString to underlying Date object', () => {
    let epoch = new Epoch(1988, 10, 25),
        date = new Date(1988, 10, 25);

    expect(epoch.toString()).toBe(date.toString());
});
