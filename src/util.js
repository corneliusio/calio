export function dispatchEvents(dispatch, el, key, data) {
    dispatch(key, data);
    if (el) {
        el.parentNode.dispatchEvent(new CustomEvent(`calio:${key}`, {
            detail: data
        }));
    }
}

export function makeDates(view, disabled) {
    let current = view.clone().startOfMonth(),
        dates = [],
        dayOfFirst,
        dayOfLast;

    if (!Array.isArray(disabled)) {
        return [];
    }

    dayOfFirst = current.dayOfWeek();

    for (let i = 0; i < dayOfFirst; i++) {
        dates.unshift(current.clone().date(-i));
    }

    current.endOfMonth();

    for (let i = 1, days = current.date(); i <= days; i++) {
        dates.push(current.clone().date(i));
    }

    dayOfLast = current.dayOfWeek();
    current.startOfMonth().addMonth();

    for (let i = 1; i < (7 - dayOfLast); i++) {
        dates.push(current.clone().date(i));
    }

    return dates;
}

export function updateRange(day, current, strict, disabled) {
    let selection = new Array().concat(current).filter(Boolean) || [],
        index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
        selection.splice(index, 1);

        return selection;
    } else if (selection.length > 1) {
        return [day.clone()];
    }

    selection = [...selection, day.clone()].sort((a, b) => {
        return a.timestamp() - b.timestamp();
    });

    if (strict) {
        let [start, end] = selection,
            isInvalid = end && !!disabled.find(d => {
                return d.isAfter(start) && d.isBefore(end);
            });

        if (isInvalid) {
            return;
        }
    }

    return selection;
}

export function updateMulti(day, current, limit) {
    let selection = new Array().concat(current).filter(Boolean) || [],
        index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
        selection.splice(index, 1);

        return selection;
    } else if (!limit || selection.length < limit) {
        selection = [...selection, day.clone()].sort((a, b) => {
            return a.timestamp() - b.timestamp();
        });

        return selection;
    }
}

export function updateSingle(day, view) {
    return [
        day.clone(),
        !view.isSameMonth(day)
            ? day.clone().startOfMonth()
            : view
    ];
}
