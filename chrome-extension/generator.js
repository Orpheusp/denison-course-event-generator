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
  var courseRows = courseTable.getElementsByTagName('tr');
  var courseRow, courseEntities, courseEntity, courseAbbr, courseEmail;
  for (var j = 0; j < courseRows.length; j ++) {
    // Get each row
    courseRow = courseRows[j];
    // Get all entities of the row.
    courseEntities = courseRow.getElementsByTagName('td');
    for (var k = 0; k < courseEntities.length; k ++) {
      courseEntity = courseEntities[k];
      // Get <abbr> embedded in the entity, if such element exists.
      courseAbbr = courseEntity.getElementsByTagName('abbr');
      // Get <a> embedded in the entity, if such element exists.
      courseEmail = courseEntity.getElementsByTagName('a');
      if (courseEntity.firstChild.nodeValue) {
        output += courseEntity.firstChild.nodeValue;
      }
      if (courseAbbr) {
        output += courseAbbr.firstChild.nodeValue;
      }
      if (courseEmail) {
        output += courseEmail.href;
      }
      output += ', ';
    }
    output += '\n';
  }
  
  // Write to csv file.
  window.open('data:text/csv;charset=utf-8,' + escape(output));
}

var btn = document.createElement('BUTTON');
var text = document.createTextNode('EXPORT CALENDAR');
btn.appendChild(text);
btn.addEventListener('click', exportCourseEvent, false);
document.getElementsByClassName('pageheaderlinks')[0].appendChild(btn);
