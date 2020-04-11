import { query } from '../helpers';
import Day from '../../src/components/Day.svelte';
import LilEpoch from '../../src/modules/LilEpoch';
import { render, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

const today = new LilEpoch();
const past = today.clone().subYear();
const future = today.clone().addYear();

const props = {
    min: null,
    max: null,
    mode: 'single'
};

test('adds "is-today" class if is today', () => {
    const targetA = document.createElement('div');
    const targetB = document.createElement('div');

    render(Day, {
        target: targetA,
        props: { ...props, day: today }
    });

    render(Day, {
        target: targetB,
        props: { ...props, day: today.clone().addDay() }
    });

    expect(targetA.querySelector('.calio-day').className)
        .toBe('calio-day is-today');

    expect(targetB.querySelector('.calio-day').className)
        .toBe('calio-day ');
});

test('adds "is-prev" class if is before viewed month', () => {
    render(Day, {
        props: { ...props, day: past }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-prev');
});

test('adds "is-next" class if is after viewed month', () => {
    render(Day, {
        props: { ...props, day: future }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-next');
});

test('adds "is-disabled" class if is disabled', () => {
    render(Day, {
        props: {
            ...props,
            day: today.clone().addDay(),
            disabled: [ today.clone().addDay() ]
        }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-disabled');
});

test('adds "is-ranged" class if is within range', () => {
    render(Day, {
        props: {
            ...props,
            mode: 'range',
            day: today.clone().addDay(),
            selection: [ past, future ]
        }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-ranged');
});

test('adds "is-active" class if is selected', () => {
    render(Day, {
        props: {
            ...props,
            day: today.clone().addDay(),
            selection: today.clone().addDay()
        }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-active');
});
