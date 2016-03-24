/**
 * Project: TACAL
 * File: TACAL.js
 * Author: Nathan Healea
 * Created: 3/15/16
 */

/* Declaring TACAL object */
var TACAL;

/* Initializing TACAL object */
TACAL = TACAL || {};

/**
 * Days of the week
 * @type {string[]}
 */
TACAL.DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Months of the year
 * @type {string[]}
 */
TACAL.MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Number of days in each month
 * @type {number[]}
 */
TACAL.CALDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Holds the current date
 * @type {Date}
 */
TACAL.TODAY = null;

/**
 * Hold calendar dates and id to be displayed.
 * @type {null}
 */
TACAL.CALENDAR = null;

/**
 * Sets TACAL information.
 */
TACAL.Init = function () {
    TACAL.TODAY = new Date();

    // Check if current month is February and if its a leap year
    if ((TACAL.TODAY.getMonth() == 1) && TACAL.LeapYear()) {

        // Change February calendar days from 28 to 29
        TACAL.CALDAYS[1] = 29;
    }

    // Initialize Calender
    TACAL.InitCalendar();
    TACAL.AddDates(TACAL.TODAY.getFullYear(), TACAL.TODAY.getMonth());

};

/**
 * Determines if the current year is a leap year.
 * @returns {boolean}
 */
TACAL.LeapYear = function () {
    var year = TACAL.TODAY.getFullYear();
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

};

/**
 * Fills CALENDAR with 31 nulls.
 * @constructor
 */
TACAL.InitCalendar = function () {
    TACAL.CALENDAR = new Array(5);
    for (var i = 0; i < 5; i++) {
        TACAL.CALENDAR[i] = new Array(7).fill(null);
    }
};

/**
 * Add the day of the month of an array that will be rendered
 * @constructor
 */
TACAL.AddDates = function (year, month) {

    var maxDaysOfMonth = TACAL.CALDAYS[TACAL.TODAY.getMonth()];
    var daysOfMonth = 0;
    var weekOfMonth = 0;
    var date = 1;
    // First day of the week in the selected month
    var firstDayOfMonth = new Date(year, month, 1).getDay();
    // Last day of the selected month
    var lastDateOfMonth = new Date(year, month + 1).getDate();
    // Last day of the previous month
    var lastDayOfPreviousMonth = 0 ? new Date(year - 1, 11, 0).getDate() : new Date(year, month, 0).getDate();

    /*
     Filling dates of previous month
     if the first day of the selected month
     is not on Sunday.
     */

    if (firstDayOfMonth != 1) {
        var lastMonthsDates = lastDayOfPreviousMonth - firstDayOfMonth + 1;
        for (var i = 0; i < firstDayOfMonth; i++) {
            var info = {year: year, month: month - 1, day: lastMonthsDates };

            TACAL.CALENDAR[weekOfMonth][daysOfMonth] = TACAL.GetDateObj(info);

            //TACAL.CALENDAR[weekOfMonth][daysOfMonth] = lastMonthsDates;
            lastMonthsDates++;
            daysOfMonth++;

        }
    }

    // Filling dates of the selected month
    do {
        do {
            var info = {year: year, month: month - 1, day: date };

            TACAL.CALENDAR[weekOfMonth][daysOfMonth] = TACAL.GetDateObj(info);
            //TACAL.CALENDAR[weekOfMonth][daysOfMonth] = date;
            date++;
            daysOfMonth++;
        } while (( daysOfMonth < 7) && ( date < maxDaysOfMonth + 1));

        if (daysOfMonth == 7) {
            daysOfMonth = 0;
            weekOfMonth++;
        }

    } while (( weekOfMonth < 5) && ( date < maxDaysOfMonth + 1));

    /*
     Filling dates of next month
     if the last day of the selected month
     is not on Saturday.
     */
    if (lastDateOfMonth != 6) {
        var nextMonthsDates = 1;
        do {
            var info = {year: year, month: month + 1, day: nextMonthsDates };
            TACAL.CALENDAR[weekOfMonth][daysOfMonth] = TACAL.GetDateObj(info);
            //TACAL.CALENDAR[weekOfMonth][daysOfMonth] = nextMonthsDates;
            nextMonthsDates++;
            daysOfMonth++;

        } while (daysOfMonth < 7);
    }

    console.log(TACAL.CALENDAR);


};

/**
 * Creates a default calendar view of the current date.
 *
 * @param id
 * @constructor
 */
TACAL.DisplayDefault = function (id) {
    var html = '';

    // --> Start table
    html += '<table>';

    // --> Start header
    html += '<thead>';

    // --> Start table row
    html += '<tr>';
    for (var i = 0; i < TACAL.DAYS.length; i++) {
        html += '<th>' + TACAL.DAYS[i] + '</th>';
    }
    html += '</tr>';
    // <-- End table row

    html += '</theader>';
    // <-- End header

    // --> Start body
    html += '<tbody>';

    console.log(TACAL.CALENDAR[1][0]);

    for (var row = 0; row < TACAL.CALENDAR.length; row++) {
        // --> Start table row
        html += '<tr>';
        for (var col = 0; col < TACAL.CALENDAR[row].length; col++) {
            html += '<td id="' + TACAL.CALENDAR[row][col].id +'">'
                + TACAL.CALENDAR[row][col].date
                + '</td>';
        }
        html += '</tr>';
        // <-- End table row
    }
    html += '</tbody>';
    // <-- End body

    html += '</table>';
    // <-- End table

    // Adding Calender to giving id
    $('#' + id).html(html);
};

/**
 * Converts year month day to unix time.
 * @param year
 * @param month
 * @param day
 * @returns {number}
 * @constructor
 */
TACAL.GetUnixTime = function (year, month, day) {

    return new Date(year, month, day).getTime();
};

/**
 * Creates an object contain informaion to be render by calendar.
 * @param args
 * @returns {{id: number, date: *, content: string}}
 * @constructor
 */
TACAL.GetDateObj = function (args) {
    var obj = {
        id: TACAL.GetUnixTime(args['year'], args['month'], args['day']),
        date:args['day'],
        content: ''};

    return obj;



};



