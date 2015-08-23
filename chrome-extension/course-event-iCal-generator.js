/*
    @function addNewCourse
    @brief Add a new course object with properties specified in courseEntities to courses object.
        A set of typical course properties includes:
        1. Time: A list of time(s) of a day when the course takes place.
        2. Day: A list of day(s) of the week when the course takes place.
        3. Place: A list of location(s) where the course takes place.
        4. Course ID: The unique identifier of the course.
        5. Instructor: The instructor(s) of the course.
        6. Exam Code: The exam code of the course.
    @param courses A group of course objects.
    @param courseTitle The title of the course.
    @param courseEntities Entities that contain properties of the course.
 */
function addNewCourse(courses, courseTitle, courseEntities) {
  // This function is for extracting a course from a courseRow and adding the course to a existing courses object.
  // Notice that the coursesEntities object must be complete.
  courses[courseTitle] = {
    'Time' : [entityValue(courseEntities[0])],
    'Day' : [entityValue(courseEntities[1])],
    'Place' : [entityValue(courseEntities[2])],
    'Course ID' : entityValue(courseEntities[5]),
    'Instructor' : entityValue(courseEntities[11]).replace('(Pmailto:', '(') + ')',
    'Exam Code' : entityValue(courseEntities[13]).trim()
  }
}

/*
    @function appendCourse
    @brief Insert additional course properties to an existing course in courses.
    @param courses A group of course objects.
    @param courseTitle The title of the course.
    @param courseEntities Entities that contain properties of the course.
 */
function appendCourse(courses, courseTitle, courseEntities) {
  courses[courseTitle]['Time'].push(entityValue(courseEntities[0]));
  courses[courseTitle]['Day'].push(entityValue(courseEntities[1]));
  courses[courseTitle]['Place'].push(entityValue(courseEntities[2]));
}

/* 
    @function entityValue
    @brief Extract value from the entity node.
    @param entity The entity node to be extracted.
    @return A string with extracted value from the entity.
 */
function entityValue(entity) {
  var retVal = '';
  // Get <abbr> embedded in the entity, if such element exists.
  abbr = entity.getElementsByTagName('abbr')[0];
  // Get <a> embedded in the entity, if such element exists.
  link = entity.getElementsByTagName('a')[0];
  if (entity.firstChild.nodeValue) {
    retVal += entity.firstChild.nodeValue;
  }
  if (abbr) {
    retVal += abbr.firstChild.nodeValue;
  }
  if (link) {
    retVal += link.href;
  }
  return retVal;
}

/*
    @function extractCourses
    @brief Create and return a gourp of courses with properties extracted from student detail schedule.
    @note In most of the time, each row of the table contains all properties of a course. However, 
        there are exceiptions:
        1. Some course's time and location have not been determined, marked as "TBA" in the table.
        2. Some course may have two sets of timing and location.
    @return A group of courses with certain properties.
 */
function extractCourses() {
  var courseTable = document.getElementsByClassName('datadisplaytable')[0];
  var courseRows = courseTable.getElementsByTagName('tr');
  var courseEntities;
  var isCourseExtension;
  var currCourseTitle;
  var courses = new Object;
  for (var i = 0; i < courseRows.length; i ++) {
    courseEntities = courseRows[i].getElementsByTagName('td');
    isCourseExtension = courseRows[i].getElementsByClassName('dddead');
    if (courseEntities.length) {
      if (isCourseExtension.length) {
        appendCourse(courses, currCourseTitle, courseEntities);
      } else {
        currCourseTitle = entityValue(courseEntities[6]);
        addNewCourse(courses, currCourseTitle, courseEntities);
      }
    }
  }
  return courses;
}

function logCourses(courses) {
  var keys = Object.keys(courses);
  var course;
  for (var j = 0; j < keys.length; j ++) {
    console.log(keys[j]);
    course = courses[keys[j]];
    console.log('  Time: ' + course['Time']);
    console.log('  Day: ' + course['Day']);
    console.log('  Place: ' + course['Place']);
    console.log('  Course ID: ' + course['Course ID']);
    console.log('  Instructor: ' + course['Instructor']);
    console.log('  Exam Code: ' + course['Exam Code']);
  }
}

function exportCourseICal() {
  var courses = extractCourses();
  var output = '';
  output += 'BEGIN:VCALENDAR\n';
  
  // Add calendar information.
  output += calendarHead();
  
  // Add course event course by course.
  var keys = Object.keys(courses);
  var course;
  for (var j = 0; j < keys.length; j ++) {
    output += courseICalEvent(keys[j], courses[[keys[j]]]);
  }
  
  output += 'END:VCALENDAR\n';
  
  // Write to iCal file.
  var outputFile = document.createElement('a');
  outputFile.download = 'course_calendar.ics';
  outputFile.href = 'data:text/calendar;charset=utf-8,' + escape(output);
  outputFile.click();
}

function calendarHead() {
  var output = '';
  output += 'PRODID:-//Google Inc//Google Calendar 70.9054//EN\n';
  output += 'VERSION:2.0\n';
  output += 'CALSCALE:GREGORIAN\n';
  output += 'METHOD:PUBLISH\n';
  return output;
}

function courseICalEvent(courseName, course) {
  var output = '';
  var endDay = '20151212T000000';
  var createdTime = new Date();
  // Assuming that for every course time period there is a Place and a Day entities assorciated with it.
  for (var i = 0; i < course['Time'].length; i ++) {
    if (course['Time'][i] == 'TBA') continue;
    output += 'BEGIN:VEVENT\n';
    output += 'DTSTART;TZID=America/New_York:' + decomposeStartTime(course['Time'][i], course['Day'][i])+ '\n';
    output += 'DTEND;TZID=America/New_York:' + decomposeEndTime(course['Time'][i], course['Day'][i])+ '\n';
    output += 'RRULE:FREQ=WEEKLY;UNTIL=' + endDay + ';BYDAY=' + decomposeDay(course['Day'][i]) + '\n';
    output += 'CREATED:' + formatOutputDate(createdTime) + '\n';
    output += 'SUMMARY:' + course['Course ID'] + ': ' + courseName + '\n';
    output += 'LOCATION:' + course['Place'][i] + '\n';
    output += 'STATUS:CONFIRMED\n';
    output += 'DESCRIPTION:' + '[Instructor] ' + course['Instructor'] + ' [Exam Code] ' + course['Exam Code'] + '\n';
    output += 'END:VEVENT\n';
  }
  return output;
}

function decomposeStartDay(days) {
  if (days.includes('R')) return '08/27/2015';
  if (days.includes('F')) return '08/28/2015';
  if (days.includes('M')) return '08/31/2015';
  if (days.includes('T')) return '09/01/2015';
  if (days.includes('W')) return '09/02/2015';
}

function decomposeStartTime(timeInterval, days) {
  var startTime = timeInterval.split('-')[0].trim();
  var outputDate = new Date(decomposeStartDay(days) + ' ' + startTime + ' GMT-0000');
  return formatOutputDate(outputDate);
}

function decomposeEndTime(timeInterval, days) {
  var endTime = timeInterval.split('-')[1].trim();
  var outputDate = new Date(decomposeStartDay(days) + ' ' + endTime + ' GMT-0000');
  return formatOutputDate(outputDate);
}

function decomposeDay(days) {
  var output = '';
  for (var i = 0; i < days.length; i ++) {
    if (i > 0) output +=',';
    if (days[i] == 'M') output += 'MO';
    if (days[i] == 'T') output += 'TU';
    if (days[i] == 'W') output += 'WE';
    if (days[i] == 'R') output += 'TH';
    if (days[i] == 'F') output += 'FR';
  }
  return output;
}

function formatOutputDate(outputDate) {
  return outputDate.toISOString().replace(/-|:|.000Z/g, '');
}

