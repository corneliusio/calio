const token = /s{1,2}|m{1,2}|h{1,4}|Do|D{1,4}|Mo|M{1,4}|YY(?:YY)?|[aA]|"[^"]*"|'[^']*'/g;
const formats = {
    masks: {
        default: 'DDD MMM DD YYYY hhh:mm:ss',
        shortDate: 'M/D/YY',
        mediumDate: 'MMM D, YYYY',
        longDate: 'MMMM D, YYYY',
        fullDate: 'DDDD, MMMM D, YYYY',
        isoDate: 'YYYY-MM-DD',
        isoDateTime: "YYYY-MM-DD'T'hh:mm:ss",
        isoUtcDateTime: "YYYY-MM-DD'T'hh:mm:ss'Z'"
    },
    words: {
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
    date = date instanceof Date ? date : new Date(date);
    mask = `${formats.masks[mask] || mask || formats.masks.default}`;

    let d = date.getDate(),
        s = date.getSeconds(),
        m = date.getMinutes(),
        h = date.getHours(),
        D = date.getDay(),
        M = date.getMonth(),
        Y = date.getFullYear(),
        a = h > 11 ? 'pm' : 'am',
        o = n => {
            return [ 'th', 'st', 'nd', 'rd' ][n % 10 > 3 ? 0 : (n % 100 - n % 10 !== 10) * n % 10];
        },
        flags = {
            s: s,
            ss: pad(s),
            m: m,
            mm: pad(m),
            h: h,
            hh: pad(h),
            hhh: h % 12 || 12,
            hhhh: pad(h % 12 || 12),
            a: a,
            A: a.toUpperCase(),
            D: d,
            Do: `${d}${o(d)}`,
            DD: pad(d),
            DDD: formats.words.dayNames[D],
            DDDD: formats.words.dayNames[D + 7],
            M: M + 1,
            Mo: `${M + 1}${o(M + 1)}`,
            MM: pad(M + 1),
            MMM: formats.words.monthNames[M],
            MMMM: formats.words.monthNames[M + 12],
            YY: String(Y).slice(2),
            YYYY: Y
        };

    return mask.replace(token, $0 => {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
}
