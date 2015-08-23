function exportCourseFinalICal() {
  httpGetAsync("https://denison.edu/academics/curriculum/final-exam-schedule", function(responseXML) {
    var finalTimeTable = decomposeFinalTimeTable(responseXML);
    
    var courses = extractCourses();
    var output = '';
    output += 'BEGIN:VCALENDAR\n';

    // Add calendar information.
    output += calendarHead();

    // Add course event course by course.
    var keys = Object.keys(courses);
    var course;
    for (var j = 0; j < keys.length; j ++) {
      output += courseFinalICalEvent(keys[j], courses[[keys[j]]], finalTimeTable);
    }

    output += 'END:VCALENDAR\n';

    // Write to iCal file.
    var outputFile = document.createElement('a');
    outputFile.download = 'course_final_calendar.ics';
    outputFile.href = 'data:text/calendar;charset=utf-8,' + escape(output);
    outputFile.click();
  });
}

function extractFinalTimeTable(responseXML) {
  var tables = responseXML.getElementsByTagName("table");
  var tableCaption;
  for (var i = 0; i < tables.length; i ++) {
    tableCaption = tables[i].getElementsByTagName("caption")[0].firstChild.nodeValue;
    if (tableCaption == 'Final Exam Dates/Times') {
      return tables[i];
    }
  }
}

function decomposeFinalTimeTable(responseXML) {
  var finalTimeTableContent = extractFinalTimeTable(responseXML);
  var finalTimeTableRows = finalTimeTableContent.getElementsByTagName('tr');
  var finalTimeTableEntities;
  var finalTimeTable = new Object();
  var finalCode, finalDate, finalTime;
  for (var i = 0; i < finalTimeTableRows.length; i ++) {
    finalTimeTableEntities = finalTimeTableRows[i].getElementsByTagName('td');
    if (finalTimeTableEntities.length) {
      finalDate = finalTimeTableEntities[0].firstChild.nodeValue;
      finalTime = finalTimeTableEntities[1].firstChild.nodeValue;
      finalCode = finalTimeTableEntities[2].firstChild.nodeValue;
      finalTimeTable[finalCode] = {
        'Start Time' : decomposeFinalStartTime(finalDate, finalTime),
        'End Time' : decomposeFinalEndTime(finalDate, finalTime)
      }
    }
  }
  return finalTimeTable;
}

function logFinalTimeTable(finalTimeTable) {
  var keys = Object.keys(finalTimeTable);
  var final;
  for (var j = 0; j < keys.length; j ++) {
    console.log('Final Code: ' + keys[j]);
    final = finalTimeTable[keys[j]];
    console.log('  Start Time: ' + final['Start Time']);
    console.log('  End Time: ' + final['End Time']);
  }
}

function courseFinalICalEvent(courseName, course, finalTimeTable) {
  var output = '';
  var examCode = course['Exam Code'];
  var createdTime = new Date();

  if (course['Exam Code'].length) {
    output += 'BEGIN:VEVENT\n';
    output += 'DTSTART;TZID=America/New_York:' + finalTimeTable[examCode]['Start Time'] + '\n';
    output += 'DTEND;TZID=America/New_York:' + finalTimeTable[examCode]['End Time'] + '\n';
    output += 'CREATED:' + formatOutputDate(createdTime) + '\n';
    output += 'SUMMARY:' + 'FINAL: ' + course['Course ID'] + ': ' + courseName + '\n';
    output += 'STATUS:CONFIRMED\n';
    output += 'DESCRIPTION:' + '[Instructor] ' + course['Instructor'] + ' [Exam Code] ' + examCode + '\n';
    output += 'END:VEVENT\n';
  }
  return output;
}

function decomposeFinalStartTime(finalDate, finalTime) {
  var startTime = decomposeFinalTimeInterval(finalTime)[0];
  var outputDate = new Date(finalDate + ' ' + startTime + ' GMT-0000');
  return formatOutputDate(outputDate);
}

function decomposeFinalEndTime(finalDate, finalTime) {
  var endTime = decomposeFinalTimeInterval(finalTime)[1];
  var outputDate = new Date(finalDate + ' ' + endTime + ' GMT-0000');
  return formatOutputDate(outputDate);
}

function decomposeFinalTimeInterval(finalTime) {
  var timeAttr;
  var timeInterval;
  
  if (finalTime.includes('A.M.')) {
    finalTime = finalTime.replace('A.M.', '');
    timeAttr = 'am';
  }
  
  if (finalTime.includes('P.M.')) {
    finalTime = finalTime.replace('P.M.', '');
    timeAttr = 'pm';
  }
  
  timeInterval = finalTime.split('-');
  timeInterval[0] += timeAttr;
  timeInterval[1] += timeAttr;
  return timeInterval;
}

function httpGetAsync(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseXML);
    }
  }
  xmlHttp.open("GET", url, true); // true for asynchronous 
  xmlHttp.responseType = 'document';
  xmlHttp.send(null);
}