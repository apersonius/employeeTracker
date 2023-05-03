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
        }
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.log('\n');
        console.table((results));
        promptUser();
    })
}