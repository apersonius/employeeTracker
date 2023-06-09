const inquirer = require('inquirer');
const connection = require('./db/connection');
require('console.table');

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
            case 'view all departments':
                viewAllDepartments();
                break;
            case 'view all roles':
                viewAllRoles();
                break;
            case 'view all employees':
                viewAllEmployees();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'update an employee role':
                updateEmployeeRole();
                break;
            case 'exit':
                connection.end();
                break;
        }
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.log('\n');
        console.table(results);
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

// function viewAllEmployees() {
//     connection.query(
//         'SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ``, manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id  JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.managerid = manager.id',
//         (err, results) => {
//             if (err) throw err; 
//             console.table(results);
//             promptUser();
//         }
//     );
// }

function viewAllEmployees() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id  JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id',
     (err, results) => {
        if (err) throw err;
            console.table(results);
            promptUser();
});
}

function addDepartment() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'what is the department name?',
        },
    ])
    .then((answer) => {
        connection.query(
            'INSERT INTO department SET ?',
            { name: answer.name },
            (err) => {
                if (err) throw err;
                console.log(`'${answer.name}' added`);
                promptUser();
            }
        );
    });
}

function addRole() {
    connection.query('SELECT * FROM department', (err, department) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'enter role title',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'enter the salary',
            },
            {
                type: 'list',
                name: 'department',
                message: 'select the department',
                choices: department.map((department) => ({
                    name: department.name,
                    value: department.id,
                })),
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department,
                },
                (err) => {
                    if (err) throw err;
                    console.log(`'${answer.title}' added`);
                    promptUser();
                }
            );
        });
    });
}

function addEmployee() {
    connection.query('SELECT * FROM role', (err, role) => {
        if (err) throw err;
        connection.query('SELECT * FROM employee', (err, manager) => {
            if (err) throw err;
            console.table(role);
            console.table(manager);

            inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'enter the employees first name',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'enter the employees last name',
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'choose employees role',
                    choices: role.map((role) => ({
                        name: role.title,
                        value: role.id,
                    })),
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'choose the employees manager',
                    choices: manager.map((manager) => ({
                        name: manager.first_name + ' ' + manager.last_name,
                        value: manager.id,
                    }),
                    ),
                },
            ])
            .then((answer) => {
                connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.managerId,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n employee added\n`);
                    promptUser();
                })
            })
        })
    })
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employee) => {
        if (err) throw err;
        connection.query('SELECT * FROM role', (err, role) => {
            if (err) throw err;
            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'select employee to update',
                    choices: employee.map((employee) => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id,
                    })),
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'select the employees new role',
                    choices: role.map((role) => ({
                        name: role.title,
                        value: role.id,
                    })),
                },
            ])
            .then((answer) => {
                connection.query('UPDATE employee SEt role_id = ? WHERE id = ?',
                [answer.role, answer.employee],
                (err) => {
                    if (err) throw err; 
                    console.log('employee role updated');
                    promptUser();
                })
            });
        });
    });
}

promptUser();