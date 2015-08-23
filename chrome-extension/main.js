function loadCourseICalButton() {
  if (document.getElementsByClassName('datadisplaytable').length) {
    var exportButton = document.createElement('BUTTON');
    var exportButtonText = document.createTextNode('EXPORT COURSES ICAL');
    exportButton.appendChild(exportButtonText);
    exportButton.addEventListener('click', exportCourseICal, false);
    document.getElementsByClassName('pageheaderlinks')[0].appendChild(exportButton);
  }
}

function loadCourseFinalICalButton() {
  if (document.getElementsByClassName('datadisplaytable').length) {
    var exportButton = document.createElement('BUTTON');
    var exportButtonText = document.createTextNode('EXPORT COURSE FINALS ICAL');
    exportButton.appendChild(exportButtonText);
    exportButton.addEventListener('click', exportCourseFinalICal, false);
    document.getElementsByClassName('pageheaderlinks')[0].appendChild(exportButton);
  }
}

function loadCourseCSVButton() {
  if (document.getElementsByClassName('datadisplaytable').length) {
    var extractButton = document.createElement('BUTTON');
    var extractButtontext = document.createTextNode('EXTRACT COURSES');
    extractButton.appendChild(extractButtontext);
    extractButton.addEventListener('click', extractCourses, false);
    document.getElementsByClassName('pageheaderlinks')[0].appendChild(extractButton);
  }
}

//loadCourseCSVButton();
loadCourseICalButton();
loadCourseFinalICalButton();
