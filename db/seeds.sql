INSERT INTO department (name)
VALUES 
("Web Development"),
("Data Science"),
("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES 
("Lead Developer", 9876.00, 1),
("Senior Programmer", 2345.14, 1),
("Junior Programmer", 2621.81, 1),
("Data Manager", 1451.99, 2),
("Data Intern", 2621.63, 2),
("Head of Accounts", 1234.56, 3),
("Number Cruncher", 3874.26, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Robert", "Robertson",  1, null),
("Sally", "O'Malley", 2, 1),
("Taika", "Waititi", 3, 2),
("Rhys", "Darby", 3, 2),
("Anna", "Banana", 4, null),
("Jimminy", "Cricket", 5, 5),
("Gorgoth", "The Destroyer", 5, 5),
("Fred", "Flintstone", 6, null),
("Barney", "Rubble", 7, 8),
("BamBam", "Rubble", 7, 8);

