function exportCourseEvent() {
  // Get the course table.
  var courseTable = document.getElementsByClassName('datadisplaytable')[0];
  
  // Get the headers of the table.
  var courseTableHeaders = courseTable.getElementsByTagName('th');
  var output = '';
  for (var i = 0; i < courseTableHeaders.length; i ++) {
    output += courseTableHeaders[i].firstChild.nodeValue;
    output += ', ';
  }
  output += '\n';
  
  // Get all courses row by row.
  var courseRows = courseTable.getElementsByTagName('');
  window.open('data:text/csv;charset=utf-8,' + escape(output));
}

var btn = document.createElement('BUTTON');
var text = document.createTextNode('EXPORT CALENDAR');
btn.appendChild(text);
btn.addEventListener('click', exportCourseEvent, false);
document.getElementsByClassName('pageheaderlinks')[0].appendChild(btn);
