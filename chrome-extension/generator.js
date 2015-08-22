function addNewCourse(courses, courseTitle, courseEntities) {
  // This function is for extracting a course from a courseRow and adding the course to a existing courses object.
  // Notice that the coursesEntities object must be complete.
  courses[courseTitle] = {
    'Time' : [entityValue(courseEntities[0])],
    'Day' : [entityValue(courseEntities[1])],
    'Place' : [entityValue(courseEntities[2])],
    'Course ID' : entityValue(courseEntities[5]),
    'Instructor' : entityValue(courseEntities[11]),
    'Exam Code' : entityValue(courseEntities[13])
  }
}

function appendCourse(courses, courseTitle, courseEntities) {
  courses[courseTitle]['Time'].push(entityValue(courseEntities[0]));
  courses[courseTitle]['Day'].push(entityValue(courseEntities[1]));
  courses[courseTitle]['Place'].push(entityValue(courseEntities[2]));
}

function entityValue(entity) {
  var retVal = '';
  // Get <abbr> embedded in the entity, if such element exists.
  courseAbbr = courseEntity.getElementsByTagName('abbr')[0];
  // Get <a> embedded in the entity, if such element exists.
  courseLink = courseEntity.getElementsByTagName('a')[0];
  if (courseEntity.firstChild.nodeValue) {
    retVal += courseEntity.firstChild.nodeValue;
  }
  if (courseAbbr) {
    retVal += courseAbbr.firstChild.nodeValue;
  }
  if (courseLink) {
    retVal += courseLink.href;
  }
  return retVal;
}

function extractCourses() {
  var courseTable = document.getElementsByTagName('datadisplaytable')[0];
  var courseRows = courseTable.getElementsByTagName('tr');
  var courseEntities;
  var isCourseExtension;
  var currCourseTitle;
  var courses = new Object;
  for (var i = 0; i < courseRows.length; i ++) {
    courseEntities = courseRows[i].getElementsByTagName('td');
    isCourseExtension = courseRows[i].getElementsByClassName('dddead');
    if (isCourseExtension) {
      appendCourse(courses, currCourseTitle, courseEntities);
    } else {
      currCourseTitle = entityValue(courseEntities[6]);
      addNewCourse(courses, currCourseTitle, courseEntities);
    }
  }
  return courses;
}

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
  window.open('data:text/csv;charset=utf-8,' + escape(output));
}

var btn = document.createElement('BUTTON');
var text = document.createTextNode('EXPORT COURSE CSV');
btn.appendChild(text);
btn.addEventListener('click', exportCourseCSV, false);
document.getElementsByClassName('pageheaderlinks')[0].appendChild(btn);
