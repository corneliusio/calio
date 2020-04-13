import { query } from '../helpers';
import Day from '../../src/components/Day.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

const today = new Epoch();
const past = today.clone().subYear();
const future = today.clone().addYear();

const props = {
    selection: null,
    view: new Epoch(),
    mode: 'single',
    disabled: [],
    min: null,
    max: null
};

test('adds "is-today" class if is today', () => {
    const targetA = document.createElement('div');
    const targetB = document.createElement('div');

    render(Day, {
        target: targetA,
        props: { day: today, props }
    });

    render(Day, {
        target: targetB,
        props: { day: today.clone().addDay(), props }
    });

    expect(targetA.querySelector('.calio-day').className)
        .toBe('calio-day is-today');

    expect(targetB.querySelector('.calio-day').className)
        .toBe('calio-day');
});

test('adds "is-prev" class if is before viewed month', () => {
    render(Day, {
        props: { day: past, props }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-prev');
});

test('adds "is-next" class if is after viewed month', () => {
    render(Day, {
        props: { day: future, props }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-next');
});

test('adds "is-disabled" class if is disabled', () => {
    render(Day, {
        props: {
            day: today.clone().addDay(),
            props: {
                ...props,
                disabled: [ today.clone().addDay() ]
            }
        }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-disabled');
});

test('adds "is-ranged" class if is within range', () => {
    render(Day, {
        props: {
            day: today.clone().addDay(),
            props: {
                ...props,
                mode: 'range',
                selection: [ past, future ]
            }
        }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-ranged');
});

test('adds "is-active" class if is selected', () => {
    render(Day, {
        props: {
            day: today.clone().addDay(),
            props: {
                ...props,
                selection: today.clone().addDay()
            }
        }
    });

    expect(query('.calio-day').className)
        .toBe('calio-day is-active');
});
