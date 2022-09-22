let mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const prompt = inquirer.createPromptModule();

console.table([{name: "Sam", role: "Engineer"}]);
Initialize();
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
        // console.log(`Connected to the employee_db database.`));
        console.log("WELCOME TO THE EMPLOYEE TRACKER"));


// db.query(`
// SELECT * FROM employee
// `, (err, employees) => {
//     console.log(employees);
// });

db.query(`
SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name ,
role.title,
role.salary,
CONCAT(m.first_name, ' ', m.last_name)  AS manager

FROM employee
LEFT JOIN role
ON employee.role_id = role.id
LEFT JOIN employee AS m
ON employee.manager_id = m.id
`, (err, employees) => {
    console.table(employees);
});
}