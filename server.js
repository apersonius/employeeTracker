const inquirer = require('inquirer');
const connection = require('./db/connection');

function promptUser() {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'select an option',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'exit',
            ],
        },
    ])
    .then((answer) => {
        switch (answer.action) {
            case 'view all departments()':
                viewAllDepartments();
                break;
            case 'view all roles':
                viewAllRoles();
                break;
            case 'view all employees':
                viewAllEmployees();
                break;
        }
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.log('\n');
        console.table((results));
        promptUser();
    });
}

function viewAllRoles() {
    connection.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id',
    (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}

function viewAllEmployees() {
    connection.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ``, manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id  JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.managerid = manager.id',
        (err, results) => {
            if (err) throw err; 
            console.table(results);
            promptUser();
        }
    );
}