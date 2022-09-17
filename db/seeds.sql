INSERT INTO department (name)
VALUES 
("Web Development"),
("Data Science"),
("Math");

INSERT INTO role (title, salary, department_id)
VALUES 
("Manager", 9876.00, 1),
("Womanager", 2345.14, 1),
("Cofee Getter", 2621.81, 1),
("Judge Jury and Executioner", 1451.99, 2),
("Village Idiot", 2621.63, 2),
("Grand Poobah", 1234.56, 3),
("Regular Joe", 3874.26, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Bobby", "Robby",  1, null),
("Sally", "BoBalley", 2, 1),
("Taika", "Watiti", 3, 2),
("Anna", "Banana", 4, null),
("Mister", "Congressman", 5, 4),
("Fred", "Flintstone", 6, null),
("Barney", "Rubble", 7, 6);

