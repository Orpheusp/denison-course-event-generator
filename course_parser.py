import codecs
from copy import deepcopy
from bs4 import BeautifulSoup

def main():
  srcfile = codecs.open('./course_page.html', 'r')
  text = srcfile.read()
  soup = BeautifulSoup(text, 'html.parser')
  
  courses = courses_parser(soup)

  for course_name, course in courses.items():
    print course_name 
    for entity_name, entity in course.items():
      print "  ", entity_name, ": ", entity
    print

def courses_parser(soup):
  course_table = soup.find('table', {'class' : 'datadisplaytable'})

  labels = []
  courses = {}
  curr_course = ''
  course = {}
  entities = []
  table_rows = course_table.findAll('tr')
  for row in table_rows:
    if row.has_attr('align') and row['align'] == 'left':
      entities = row.findAll('th')
      for entity in entities:
        labels.append(entity.string)
    else:
      entities = row.findAll('td')
      if row.find('td', {'class' : 'dddead'}):
        # continue current course
        course = courses[curr_course]
        for index, entity in enumerate(entities):
          course[labels[index]].append(entity.string)
      else:
        course = {}
        curr_course = ''
        for index, entity in enumerate(entities):
          course[labels[index]] = [entity.string]
          if labels[index] == 'Title':
            curr_course = entity.string
        
        courses[curr_course] = deepcopy(course)
  return courses

main()
