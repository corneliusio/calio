import format from '../src/modules/format';
import Epoch from '../src/modules/Epoch';

const date = new Date(1988, 10, 1);

test('formats default', () => {
    expect(format(date)).toBe('Tue Nov 01 1988 12:00:00');
    expect(format(date, null)).toBe('Tue Nov 01 1988 12:00:00');
});

test('format shortDate', () => {
    expect(format(date, 'shortDate')).toBe('11/1/88');
});

test('format mediumDate', () => {
    expect(format(date, 'mediumDate')).toBe('Nov 1, 1988');
});

test('format longDate', () => {
    expect(format(date, 'longDate')).toBe('November 1, 1988');
});

test('format fullDate', () => {
    expect(format(date, 'fullDate')).toBe('Tuesday, November 1, 1988');
});

test('format isoDate', () => {
    expect(format(date, 'isoDate')).toBe('1988-11-01');
});

test('format isoDateTime', () => {
    expect(format(date, 'isoDateTime')).toBe('1988-11-01T00:00:00');
});

test('format isoUtcDateTime', () => {
    expect(format(date, 'isoUtcDateTime')).toBe('1988-11-01T00:00:00Z');
});

test('has some flags', () => {
    expect(format(date, 'D Do DD DDD DDDD M Mo MM MMM MMMM YY YYYY'))
        .toBe('1 1st 01 Tue Tuesday 11 11th 11 Nov November 88 1988');
});

test('can format an instance of Epoch', () => {
    expect(format(new Epoch(date), 'D Do DD DDD DDDD M Mo MM MMM MMMM YY YYYY'))
        .toBe('1 1st 01 Tue Tuesday 11 11th 11 Nov November 88 1988');
});
