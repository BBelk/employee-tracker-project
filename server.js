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
        'Update An Employee Manager',
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
    if(response.doNext == "View All Departments"){ViewAllDepartments();}
    if(response.doNext == "View All Roles"){ViewAllRoles();}
    if(response.doNext == "View All Employees"){ViewAllEmployees();}
    if(response.doNext == "Add A Department"){AddADepartment();}
    if(response.doNext == "Add A Role"){AddARole();}
    if(response.doNext == "Add An Employee"){AddAnEmployee();}
    if(response.doNext == "Update An Employee Role"){UpdateAnEmployeeRole();}
    if(response.doNext == "Update An Employee Manager"){UpdateAnEmployeeManager();}
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
    db.query('SELECT role.title, role.id, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;', (error, response) => {
        if (error) throw error;
        console.log('\n');
        console.log("ROLES");
        DoLine();
        console.table(response);
        DoLine();
        MainMenu();
        });
}

function ViewAllEmployees(){
    managerNameArray = ["No Manager"];
    GetManagerNames();
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM employee ',  (error, response)=>{
            if(error){
                return reject(error);
            }

            console.log("MANAGER NAME ARRAY " + managerNameArray);
            console.log("MANAGER ID ARRAY " + managerIdArray);
           
    // "${managerNameArray[managerIdArray.indexOf(employee.manager_id)]}"
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary AS salary, employee.manager_id AS manager_id FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id ORDER BY id ASC;`, (error, response) => {
        if (error) throw error;
        console.log('\n');
        console.log("EMPLOYEES");
        DoLine();
        console.table(response);
        DoLine();
        MainMenu();
        });
    });
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
            MainMenu();
            });
    });
}


function AddARole(){
    let departmentArray = [];
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
        response.roleDepartment = departmentArray.indexOf(response.roleDepartment) +1;
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

// let roleArray = [];
let managerNameArray = [];
let managerIdArray = [];

function GetManagerNames(){
    return new Promise((resolve, reject)=>{
        // managerNameArray = ["NULL"];
        managerIdArray = ["NULL"];
        db.query('SELECT * FROM employee ',  (error, response)=>{
            if(error){
                return reject(error);
            }
            response.forEach((employee) => {
                if(employee.manager_id == null){
                managerNameArray.push(employee.first_name + " " + employee.last_name);
                managerIdArray.push(employee.id); }});
            });
        });
    }


function AddAnEmployee(){
    managerNameArray= ["NULL"];
    GetManagerNames();
    roleArray = [];
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM role ',  (error, response)=>{
            if(error){
                return reject(error);
            }
            response.forEach((role) => { roleArray.push(role.title); });
            // console.log("ROLE ARRAY " + roleArray);
            // console.log("MANAGER NAME ARRAY " + managerNameArray);
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
            type: 'rawlist',
            name: 'employeeRole',
            message: "Enter New Employee's Role",
            choices: roleArray
        },
        {
            type: "rawlist",
            name: 'employeeManager',
            message: "Enter New Employee's Manager, if none enter null",
            choices: managerNameArray
        }
    ])
    .then(response => {
        let managerMaybeNull = "";
        managerMaybeNull = managerIdArray[managerNameArray.indexOf(response.employeeManager)];
        console.log(roleArray + "THIS IS THE ROLE ARRAY");
        response.employeeRole = roleArray.indexOf(response.employeeRole) + 1;
        console.log(response.employeeRole + "THIS IS THE CHOSEN ROLE ARRAY INDEX");
        if(response.employeeManager != "NULL"){
            // managerMaybeNull = NULL;
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("${response.employeeFirstName}", "${response.employeeLastName}", "${response.employeeRole}", "${managerMaybeNull}");`, (error, response) => {
            if (error) throw error;
            console.log('\n');
            console.log("Employee added succesfully");
            DoLine();
            // console.table(response);
            // DoLine();
            MainMenu();
            });
        }else{
            db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES("${response.employeeFirstName}", "${response.employeeLastName}", "${response.employeeRole}");`, (error, response) => {
                if (error) throw error;
                console.log('\n');
                console.log("Employee added succesfully");
                DoLine();
                // console.table(response);
                // DoLine();
                MainMenu();
                });
            }
    });
    });
});
}

function UpdateAnEmployeeRole(){
    return new Promise((resolve, reject)=>{
    db.query(`SELECT * FROM employee`, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employee) => { employeeArray.push(`${employee.first_name}` + " " + `${employee.last_name}`); });
        return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM role`, (error, response) => {
            if (error) throw error;
            let roleArray = [];
            response.forEach((role) => { roleArray.push(role.title); });
            console.log("ROLE ARRAY: " + roleArray);

            inquirer.prompt([
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Choose Which Employee To Assign New Role',
                    choices: employeeArray
                },
                {
                    name: 'chosenRole',
                    type: 'list',
                    message: 'Choose New Role',
                    choices: roleArray
                }
            ])
                .then((answers) => {
                    let newTitleId, employeeId;
                    managerIdArray[managerNameArray.indexOf(answers.chosenManager)]
                    newTitleId = roleArray.indexOf(answers.chosenRole) + 1;
                    console.log("CHOSEN ROLE ID IS " + newTitleId + "   " + answers.chosenRole);
                    console.log("array role is " + roleArray.indexOf(answers.chosenRole) + 1);
                  
                    employeeId = employeeArray.indexOf(answers.chosenEmployee) + 1;
                    console.log("CHOSEN EMPLOYEE " + employeeId + "    " + answers.chosenEmployee);
                    console.log("employee array is " + employeeArray.indexOf(answers.chosenEmployee) + 1);
                    
                    db.query(`UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`, [newTitleId, employeeId], (error) => {
                            if (error) throw error;
                            console.log(`\n`);
                            DoLine();
                            console.log(`Employee Role Updated`);
                            DoLine();
                            // promptUser();
                            MainMenu();
                        }
                    );
                });
        });
    }); });
});
    
}
function UpdateAnEmployeeManager(){
   
    managerNameArray= ["NULL"];
    GetManagerNames();
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM employee ',  (error, response)=>{
            if(error){
                return reject(error);
            }
            let employeeArray = [];
        response.forEach((employee) => { employeeArray.push(`${employee.first_name}` + " " + `${employee.last_name}`); });

            inquirer.prompt([
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Choose Which Employee To Assign New Role',
                    choices: employeeArray
                },
                {
                    name: 'chosenManager',
                    type: 'list',
                    message: 'Choose New Manager, if no manager select NULL',
                    choices: managerNameArray
                }
            ])
                .then((answers) => {
                    let newManagerId, employeeId;
                    
                    newManagerId = managerIdArray[managerNameArray.indexOf(answers.chosenManager)];
                    console.log(newManagerId + ": IS NEW MANAGER ID");

                    response.forEach((employee) => {
                        if (answers.chosenEmployee === `${employee.first_name}` + " " + `${employee.last_name}`) {
                            employeeId = employee.id;
                        }
                    });
                    console.log('CHOSEN EMPLOYEE IS' + employeeId);
                    
                    db.query(`UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`, [newManagerId, employeeId], (error) => {
                            if (error) throw error;
                            console.log(`\n`);
                            DoLine();
                            console.log(`Employee Manager Updated`);
                            DoLine();
                            // promptUser();
                            MainMenu();
                        }
                    );
                });
        });
    });
}