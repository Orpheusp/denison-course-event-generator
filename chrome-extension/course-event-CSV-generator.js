function exportCourseCSV() {
  // Get the course table.
  var courseTable = document.getElementsByClassName('datadisplaytable')[0];
  
  var entityValue;
  // Get the headers of the table.
  var headers = [];
  var courseTableHeaders = courseTable.getElementsByTagName('th');
  var output = '';
  for (var i = 0; i < courseTableHeaders.length; i ++) {
    entityValue = courseTableHeaders[i].firstChild.nodeValue
    output += entityValue;
    output += ', ';
    headers.push(entityValue);
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
      courseAbbr = courseEntity.getElementsByTagName('abbr')[0];
      // Get <a> embedded in the entity, if such element exists.
      courseEmail = courseEntity.getElementsByTagName('a')[0];
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
  var outputFile = document.createElement('a');
  outputFile.download = 'course_calendar.csv';
  outputFile.href = 'data:text/csv;charset=utf-8,' + escape(output);
  outputFile.click();
}