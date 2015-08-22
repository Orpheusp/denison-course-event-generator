function loadICalButton() {
  var exportButton = document.createElement('BUTTON');
  var exportButtonText = document.createTextNode('EXPORT COURSE ICAL');
  exportButton.appendChild(exportButtonText);
  exportButton.addEventListener('click', exportCourseICal, false);
  document.getElementsByClassName('pageheaderlinks')[0].appendChild(exportButton);
}

function loadCSVButton() {
  var extractButton = document.createElement('BUTTON');
  var extractButtontext = document.createTextNode('EXTRACT COURSES');
  extractButton.appendChild(extractButtontext);
  extractButton.addEventListener('click', extractCourses, false);
  document.getElementsByClassName('pageheaderlinks')[0].appendChild(extractButton);
}

loadCSVButton();
loadICalButton();
