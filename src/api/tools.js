export function formatDate(stamp) {
  var date = new Date(stamp);
  var year = '' + date.getFullYear();
  // var month = date.getMonth();//0-11
  var day = '' + date.getDate();//date 1-31
  var hour = '' + date.getHours();
  var minutes = '' + date.getMinutes();
  var seconds = '' + date.getSeconds();
  //  using getDay().0-6
  var weekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var week = weekArray[date.getDay()];

  var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var month = monthArray[date.getMonth()]
  month = month.padStart(2, '0');
  day = day.padStart(2, '0');
  hour = hour.padStart(2, '0');
  minutes = minutes.padStart(2, '0');
  seconds = seconds.padStart(2, '0');
  var formattedDate = week + ' ' + month + ' ' + day + ' ' + year;

  return formattedDate;
}