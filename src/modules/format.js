const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhsTt])\1?|[LloS]|"[^"]*"|'[^']*'/g;
const formats = {
    masks: {
        default: 'ddd mmm dd yyyy 00:00:00',
        shortDate: 'm/d/yy',
        mediumDate: 'mmm d, yyyy',
        longDate: 'mmmm d, yyyy',
        fullDate: 'dddd, mmmm d, yyyy',
        isoDate: 'yyyy-mm-dd',
        isoDateTime: "yyyy-mm-dd'T'00:00:00",
        isoUtcDateTime: "yyyy-mm-dd'T'00:00:00'Z'"
    },
    i18n: {
        dayNames: [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ],
        monthNames: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ]
    }
};

function pad(val, len = 2) {
    val = `${val}`;
    while (val.length < len) {
        val = `0${val}`;
    }

    return val;
}

export default function(date, mask = 'default') {

    if (typeof date === 'object' && 'timestamp' in date) {
        date = date.timestamp();
    }

    date = date instanceof Date ? date : new Date(date);
    mask = `${formats.masks[mask] || mask || formats.masks.default}`;

    let d = date.getUTCDate(),
        D = date.getUTCDay(),
        m = date.getUTCMonth(),
        y = date.getUTCFullYear(),
        flags = {
            d: d,
            dd: pad(d),
            ddd: formats.i18n.dayNames[D],
            dddd: formats.i18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: formats.i18n.monthNames[m],
            mmmm: formats.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            S: [ 'th', 'st', 'nd', 'rd' ][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
        };

    return mask.replace(token, $0 => {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
}
