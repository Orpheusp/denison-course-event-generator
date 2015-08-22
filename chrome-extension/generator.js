function exportCourseEvent() {
  var csv = "";
  window.open('data:text/csv;charset=utf-8,' + escape(csv));
}

var btn = document.createElement('BUTTON');
var text = document.createTextNode("EXPORT CALENDAR");
btn.appendChild(text);
btn.addEventListener("click", exportCourseEvent, false);
document.getElementsByClassName('pageheaderlinks')[0].appendChild(btn);
