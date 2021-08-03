import moment from "moment";
import React from "react";

export default function getRelativeTime(time) {
    moment.locale();
    let now = new Date();
    let todayDate = moment(now);
    let pastDate = moment(time);

    var dDiff2 = pastDate.diff(todayDate);
    if (dDiff2 > 0) {
        return <span className=""> {moment(time).format('LL')} ({moment(time).startOf('day').fromNow()}) </span>

    } else {
        return <span
            className="text-red-400"> {moment(time).format('LL')} ({moment("01-02-2021").startOf('day').fromNow()}) </span>

    }

}
export const getReadableTime = function getReadableTime(time) {
    moment.locale();
    return moment(time).format('LLL');
    ;
}



// export const getDateComparison= function getDateComparison(time) {
//     const date1 = days(time).format('DD-MM-YYYY')
//     let newDiff=  date1.diff("2015-5-1", 'day')
//
//     console.log("new",newDiff)
//     return  newDiff;
// }
