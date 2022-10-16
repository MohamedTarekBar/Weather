'use strict';

export function showTime (getSession) {
  var date = new Date ();
  var h = date.getHours (); // 0 - 23
  var m = date.getMinutes (); // 0 - 59
  var s = date.getSeconds (); // 0 - 59
  var session = 'AM';

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = 'PM';
  }

  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  var time = h + ':' + m + ':' + s + ' ' + session;
  document.getElementById ('MyClockDisplay').innerHTML = time;
  setTimeout (showTime, 1000);
  return session;
}

function padTo2Digits (num) {
  return num.toString ().padStart (2, '0');
}

function formatDate (date) {
  return [
    padTo2Digits (date.getDate ()),
    padTo2Digits (date.getMonth () + 1),
    date.getFullYear (),
  ].join ('/');
}
export function convertTimeEpoch (time) {
  var utcSeconds = time;
  var d = new Date (0);
  d.setUTCSeconds (utcSeconds);
  return formatDate (d);
}

export function getDayName(time) {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var utcSeconds = time;
  var d = new Date (0);
  d.setUTCSeconds (utcSeconds);
  var dayName = days[d.getDay()];
  return dayName
}