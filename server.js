const express = require('express');
const inquirer = require('inquirer');
let mysql = require('mysql2');
//  mysql = require('mysql2/promise');
const cTable = require('console.table');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
function DoLine(){
    console.log(`------------------------------------------------------`);
}
let db;
async function Initialize(){
db = await mysql.createConnection(
{
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: '',
    database: 'employee_db'
},
console.log(`Connected to the employee_db database.`));
MainMenu();
}


const startQuestions = [
{
    name: 'doNext',
    type: 'list',
    choices:[
        'View All Departments', 
        'View All Roles',
        'View All Employees',
        'Add A Department', 
        'Add A Role', 
        'Add An Employee', 
        'Update An Employee Role',
    ],
    message: 'Select an Option',
}
];

Initialize();

// db.query('SELECT * FROM employee', (error, response) => {
//     if (error) throw error;
//     doLine;
//     console.table(response);
//     doLine;
//     });

function MainMenu(){
    inquirer.prompt(startQuestions)
    .then(response => {
    // console.log(response);
    if(response.doNext == "View All Departments"){ViewAllDepartments();}
    if(response.doNext == "View All Roles"){ViewAllRoles();}
    if(response.doNext == "View All Employees"){ViewAllEmployess();}
    if(response.doNext == "Add A Department"){AddADepartment();}
    if(response.doNext == "Add A Role"){AddARole();}
    if(response.doNext == "Add An Employee"){AddAnEmployee();}
    if(response.doNext == "Update An Employee Role"){UpdateAnEmployeeRole();}
});
}

function ViewAllDepartments(){
    db.query('SELECT * FROM department', (error, response) => {
    if (error) throw error;
    console.log('\n');
    console.log("DEPARTMENTS");
    DoLine();
    console.table(response);
    DoLine();
    MainMenu();
    });
}

function ViewAllRoles(){
    db.query('SELECT role.title, role.id, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id;', (error, response) => {
        if (error) throw error;
        console.log('\n');
        console.log("ROLES");
        DoLine();
        console.table(response);
        DoLine();
        MainMenu();
        });
}

function ViewAllEmployess(){
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary AS salary, employee.manager_id AS manager_id FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id;', (error, response) => {
        if (error) throw error;
        console.log('\n');
        console.log("EMPLOYEES");
        DoLine();
        console.table(response);
        DoLine();
        MainMenu();
        });
}

function AddADepartment(){
    inquirer.prompt([
        {
            name: 'departmentName',
            message : 'Enter New Department Name'
        }
    ])
    .then(response => {
        db.query(`INSERT INTO department (name) VALUES("${response.departmentName}");`, (error, response) => {
            if (error) throw error;
            console.log('\n');
            console.log("Department added succesfully");
            DoLine();
            // console.table(response);
            // DoLine();
            MainMenu();
            });
    });
}
///////////////////////////////////////////////////////////
// const addRole = () => {
//     const sql = `
//     SELECT * FROM department`
//     connection.query('SELECT * FROM department', (error, response) => {
//         if (error) throw error;
//         let departmentArray = [];
//         response.forEach((department) => { deptArray.push(department.department_name); });
//         deptArray.push('Create Department');
//     });
///////////////////////////////////////////////////////////
let departmentArray = [];
function GetDepartments(){
    departmentArray = [];
    db.query('SELECT * FROM department', (error, response) => {
        if (error) throw error;
        response.forEach((department) => { departmentArray.push(department.department_name); });
        // deptArray.push('Create Department');
    });
    return departmentArray;
    
}

function AddARole(){
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM department ',  (error, response)=>{
            if(error){
                return reject(error);
            }
            response.forEach((department) => { departmentArray.push(department.name); });
    inquirer.prompt([
        {
            name: 'roleTitle',
            message : 'Enter New Role Title'
        },
        {
            name: 'roleSalary',
            message: 'Enter New Role Salary'
        },
        {
            type: 'rawlist',
            name: 'roleDepartment',
            message: 'Select New Department',
            choices: departmentArray
        }
    ])
    .then(response => {
        response.roleDepartment = departmentArray.indexOf(response.roleDepartment);
        db.query(`INSERT INTO role (title, salary, department_id) VALUES("${response.roleTitle}", "${response.roleSalary}", "${response.roleDepartment}");`, (error, response) => {
            if (error) throw error;
            console.log('\n');
            console.log("Role added succesfully");
            DoLine();
            // console.table(response);
            // DoLine();
            MainMenu();
            });
        });
    });
});
}

//////////////////////////////////////////////////////////////////
const updateEmployeeRole = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employee) => { employeeArray.push(`${employee.first_name} ${employee.last_name}`); });

        let sql = `SELECT role.id, role.title FROM role`;
        connection.query(sql, (error, response) => {
            if (error) throw error;
            let rolesArray = [];
            response.forEach((role) => { rolesArray.push(role.title); });

            inquirer.prompt([
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Which employee has a new role>',
                    choices: employeeArray
                },
                {
                    name: 'chosenRole',
                    type: 'list',
                    message: 'What is their new role?',
                    choices: rolesArray
                }
            ])
                .then((answer) => {
                    let newTitleId, employeeId;
                    response.forEach((role) => {
                        if (answer.chosenRole === role.title) {
                            newTitleId = role.id;
                        }
                    });
                    response.forEach((employee) => {
                        if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                            employeeId = employee.id;
                        }
                    });
                    let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
                    connection.query(
                        sqls,
                        [newTitleId, employeeId], (error) => {
                            if (error) throw error;
                            console.log(`=====================================================`);
                            console.log(`Employee Role Updated`);
                            console.log(`=====================================================`);
                            promptUser();
                        }
                    );
                });
        });
    });
};
//////////////////////////////////////////////////////////////////

function AddAnEmployee(){
    inquirer.prompt([
        {
            name: 'employeeFirstName',
            message : "Enter New Employee's First Name"
        },
        {
            name: 'employeeLastName',
            message : "Enter New Employee's Last Name"
        },
        {
            name: 'employeeRole',
            message: "Enter New Employee's Role ID"
        },
        {
            name: 'employeeManager',
            message: "Enter New Employee's Manager ID, if none enter 0",
            default: "0"
        }
    ])
    .then(response => {
        if(response.employeeManager == "0"){response.employeeManager = "null";}
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("${response.employeeFirstName}", "${response.employeeLastName}", "${response.employeeRole}", "${response.employeeManager}");`, (error, response) => {
            if (error) throw error;
            console.log('\n');
            console.log("Employee added succesfully");
            DoLine();
            // console.table(response);
            // DoLine();
            MainMenu();
            });
    });
}

function UpdateAnEmployeeRole(){
    // inquirer.prompt
}