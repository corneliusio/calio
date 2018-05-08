import LilEpoch from '../src/modules/LilEpoch';

test('it accepts year, month, date arguments', () => {
    expect(new LilEpoch(2018, 0, 1)).toHaveProperty('value', new Date(Date.UTC(2018, 0, 1)));
});

test('it accepts another LilEpoch instance', () => {
    let epoch = new LilEpoch();

    expect(new LilEpoch(epoch)).toEqual(epoch);
});

test('it accepts a Date object', () => {
    let date = new Date();

    expect(new LilEpoch(date)).toHaveProperty('value', date);
});

test('it accepts a timestamp', () => {
    let timestamp = Date.UTC(2018, 0);

    expect(new LilEpoch(timestamp)).toHaveProperty('value', new Date(timestamp));
});

test('it accepts a date string', () => {
    expect(new LilEpoch('2018-01-01')).toHaveProperty('value', new Date('2018-01-01'));
});

test('it resets UTC hours, minutes, seconds, and milliseconds', () => {
    let date = new Date(2018, 0, 1);

    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    expect(new LilEpoch(2018, 0, 1)).toHaveProperty('value', date);
});

test('it gets/set the year', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    expect(epoch.year()).toBe(1988);

    epoch.year(1992);

    expect(epoch.year()).toBe(1992);
});

test('it gets/set the month', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    expect(epoch.month()).toBe(10);

    epoch.month(5);

    expect(epoch.month()).toBe(5);
});

test('it gets/set the date', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    expect(epoch.date()).toBe(25);

    epoch.date(27);

    expect(epoch.date()).toBe(27);
});

test('it can add days', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.addDay();

    expect(epoch.date()).toBe(26);

    epoch.addDay(2);

    expect(epoch.date()).toBe(28);
});

test('it can add months', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.addMonth();

    expect(epoch.month()).toBe(11);

    epoch.addMonth(2);

    expect(epoch.month()).toBe(1);
});

test('it can add years', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.addYear();

    expect(epoch.year()).toBe(1989);

    epoch.addYear(6);

    expect(epoch.year()).toBe(1995);
});

test('it can subtract days', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.subDay();

    expect(epoch.date()).toBe(24);

    epoch.subDay(2);

    expect(epoch.date()).toBe(22);
});

test('it can subtract months', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.subMonth();

    expect(epoch.month()).toBe(9);

    epoch.subMonth(2);

    expect(epoch.month()).toBe(7);
});

test('it can subtract years', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.subYear();

    expect(epoch.year()).toBe(1987);

    epoch.subYear(6);

    expect(epoch.year()).toBe(1981);
});

test('it gets the day of the week', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    expect(epoch.dayOfWeek()).toBe(5);
});

test('it jumps to end of month', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.endOfMonth();

    expect(epoch.month()).toBe(10);
    expect(epoch.date()).toBe(30);
});

test('it jumps to start of month', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    epoch.startOfMonth();

    expect(epoch.month()).toBe(10);
    expect(epoch.date()).toBe(1);
});

test('it checks if date is after another date', () => {
    let epoch1 = new LilEpoch(1988, 10, 25),
        epoch2 = new LilEpoch(1992, 10, 27);

    expect(epoch1.isAfter(epoch2)).toBe(false);
    expect(epoch2.isAfter(epoch1)).toBe(true);
});

test('it checks if date is before another date', () => {
    let epoch1 = new LilEpoch(1988, 10, 25),
        epoch2 = new LilEpoch(1992, 10, 27);

    expect(epoch1.isBefore(epoch2)).toBe(true);
    expect(epoch2.isBefore(epoch1)).toBe(false);
});

test('it checks if two dates are the same', () => {
    let epoch1 = new LilEpoch(1988, 10, 25),
        epoch2 = new LilEpoch(1988, 10, 25),
        epoch3 = new LilEpoch(1992, 10, 27);

    expect(epoch1.isSame(epoch2)).toBe(true);
    expect(epoch1.isSame(epoch3)).toBe(false);
});

test('it checks if two dates are in the same month', () => {
    let epoch1 = new LilEpoch(1988, 10, 23),
        epoch2 = new LilEpoch(1988, 10, 25),
        epoch3 = new LilEpoch(1992, 10, 27);

    expect(epoch1.isSameMonth(epoch2)).toBe(true);
    expect(epoch1.isSameMonth(epoch3)).toBe(false);
});

test('it checks if two dates are in the same year', () => {
    let epoch1 = new LilEpoch(1988, 9, 23),
        epoch2 = new LilEpoch(1988, 10, 25),
        epoch3 = new LilEpoch(1992, 11, 27);

    expect(epoch1.isSameYear(epoch2)).toBe(true);
    expect(epoch1.isSameYear(epoch3)).toBe(false);
});

test('it gets the timestamp', () => {
    let timestamp = Date.UTC(1988, 10, 25);

    expect(new LilEpoch(1988, 10, 25).timestamp()).toBe(timestamp);
});

test('it gets a string format of the date', () => {
    let epoch = new LilEpoch(1988, 10, 25);

    expect(epoch.format()).toBe('Fri Nov 25 1988 00:00:00');
});

test('it creates a clone date', () => {
    let epoch1 = new LilEpoch(1988, 10, 25),
        epoch2 = epoch1.clone();

    expect(epoch1).toEqual(epoch2);

    epoch2.year(2018);

    expect(epoch1.year()).toBe(1988);
    expect(epoch2.year()).toBe(2018);
});

test('it deferes toString to underlying Date object', () => {
    let epoch = new LilEpoch(1988, 10, 25),
        date = new Date(Date.UTC(1988, 10, 25));

    expect(epoch.toString()).toBe(date.toString());
});
