import format from '../src/modules/format';
import Epoch from '../src/modules/Epoch';

const date1 = new Date(1988, 10, 1, 0, 0);
const date2 = new Date(1988, 10, 1, 12, 0);

test('formats default', () => {
    expect(format(date1)).toBe('Tue Nov 01 1988 12:00:00');
    expect(format(date1, null)).toBe('Tue Nov 01 1988 12:00:00');
});

test('format shortDate', () => {
    expect(format(date1, 'shortDate')).toBe('11/1/88');
});

test('format mediumDate', () => {
    expect(format(date1, 'mediumDate')).toBe('Nov 1, 1988');
});

test('format longDate', () => {
    expect(format(date1, 'longDate')).toBe('November 1, 1988');
});

test('format fullDate', () => {
    expect(format(date1, 'fullDate')).toBe('Tuesday, November 1, 1988');
});

test('format isoDate', () => {
    expect(format(date1, 'isoDate')).toBe('1988-11-01');
});

test('format isoDateTime', () => {
    expect(format(date1, 'isoDateTime')).toBe('1988-11-01T00:00:00');
});

test('format isoUtcDateTime', () => {
    expect(format(date1, 'isoUtcDateTime')).toBe('1988-11-01T00:00:00Z');
});

test('has some flags', () => {
    expect(format(date1, 's ss m mm h hh hhh hhhh a A D Do DD DDD DDDD M Mo MM MMM MMMM YY YYYY'))
        .toBe('0 00 0 00 0 00 12 12 am AM 1 1st 01 Tue Tuesday 11 11th 11 Nov November 88 1988');

    expect(format(date2, 's ss m mm h hh hhh hhhh a A D Do DD DDD DDDD M Mo MM MMM MMMM YY YYYY'))
        .toBe('0 00 0 00 12 12 12 12 pm PM 1 1st 01 Tue Tuesday 11 11th 11 Nov November 88 1988');
});

test('can format an instance of Epoch', () => {
    expect(format(new Epoch(date1), 'D Do DD DDD DDDD M Mo MM MMM MMMM YY YYYY'))
        .toBe('1 1st 01 Tue Tuesday 11 11th 11 Nov November 88 1988');
});
