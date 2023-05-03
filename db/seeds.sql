INSERT INTO department (name)
VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 4),
('Lead Engineer', 150000, 1),
('Accountant', 125000, 2),
('Lawyer', 190000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 4, NULL),
('Ashley', 'Rodriguez', 1, NULL),
('Malia', 'Brown', 2, NULL),
('Tom', 'Allen', 3, 1),;


