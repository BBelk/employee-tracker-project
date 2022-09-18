SELECT course_names.id, 
course_names.name AS course_name, 
course_names.department_id, 
department.name AS department_name
FROM course_names
JOIN department ON course_names.department_id = department.id;

-- SELECT *
-- FROM course_names
-- JOIN department ON course_names.department = department.id;
