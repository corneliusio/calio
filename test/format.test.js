import format from '../src/modules/format';
import LilEpoch from '../src/modules/LilEpoch';

const date = new Date(Date.UTC(1988, 10, 1));

test('formats default', () => {
    expect(format(date)).toBe('Tue Nov 01 1988 00:00:00');
    expect(format(date, null)).toBe('Tue Nov 01 1988 00:00:00');
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

test('it has some flags', () => {
    expect(format(date, 'd dd ddd dddd m mm mmm mmmm yy yyyy S'))
        .toBe('1 01 Tue Tuesday 11 11 Nov November 88 1988 st');
});

test('it can format an instance of LilEpoch', () => {
    expect(format(new LilEpoch(date), 'd dd ddd dddd m mm mmm mmmm yy yyyy S'))
        .toBe('1 01 Tue Tuesday 11 11 Nov November 88 1988 st');
});
