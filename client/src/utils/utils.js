import { timeFormat, timeParse } from "d3-time-format";

// hash by states, then each state has paginations by page size 25
export function processArray(arr) {
    const hash = {}
    const pageSize = 25;
    for (var i = 0; i < arr.length; i++) {
        if (!hash[arr[i].home_state]) {
            hash[arr[i].home_state] = {};
            hash[arr[i].home_state]['index'] = 0;
            hash[arr[i].home_state]['total'] = 0;
            hash[arr[i].home_state][hash[arr[i].home_state]['index']] = [];
            hash[arr[i].home_state][hash[arr[i].home_state]['index']].push(arr[i]);
            hash[arr[i].home_state]['total'] += arr[i].trip_count;
        } else {
            if (hash[arr[i].home_state][hash[arr[i].home_state]['index']].length % pageSize === 0) {
                hash[arr[i].home_state]['index']++;
                hash[arr[i].home_state][hash[arr[i].home_state]['index']] = [];
                hash[arr[i].home_state][hash[arr[i].home_state]['index']].push(arr[i]);
            } else {
                hash[arr[i].home_state][hash[arr[i].home_state]['index']].push(arr[i]);
            }
            hash[arr[i].home_state]['total'] += arr[i].trip_count;
        }
    }
    return hash;
};

export function mergeCurrentTable(table) {
    return Object.values(table).reduce((acc, item, i) => {
        if (typeof item === 'object') {
            return acc.concat(item);
        } else {
            return acc;
        }
    }, [])
};

export function getTotal(arr) {
    return arr.reduce((acc, item) => acc + item.trip_count, 0);
}

export function groupBy(arr, key) {
    return arr.reduce((acc, next) => {
        acc[next[key]] = (acc[next[key]] || []).push(next)
        return acc;
    }, {})
}

export function comma(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

export const parserMap = {
    'year': timeParse('%Y'),
    'month': timeParse('%Y-%m'),
    'week': timeParse('%Y-%m-%W'),
    'day': timeParse('%Y-%m-%d'),
    'hour': timeParse('%Y-%m-%d-%I-%p')
}

export const formatMap = {
    'year': timeFormat('%Y'),
    'month': timeFormat('%Y-%m'),
    'week': timeFormat('%Y-%m-%W'),
    'day': timeFormat('%Y-%m-%d'),
    'hour': timeFormat('%Y-%m-%d-%I-%p')
}

export const stateMap = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}


export default { processArray, mergeCurrentTable, getTotal, groupBy }