const express = require('express');
const inquirer = require('inquirer');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


  
const internQuestions = [
    {
        name: 'newName',
        message: 'What is the Interns name?',
    },
    {
        input: 'number',
        name: 'newId',
        message: 'What is the Interns ID?',
        validate: (answer) => {
            if (isNaN(answer)) {
              return "Please enter a number";
            }
            return true;
          },
    },
    {
        name: 'newEmail',
        message: 'What is the Interns email?',
    },
    {
        name: 'newSchool',
        message: 'What is the Interns school name?',
    },
    {
        name: 'doNext',
        type: 'list',
        choices:[
            'Add Engineer',
            'Add Another Intern',
            'Done',
        ],
        message: 'Add new employees or are you done?',
    }
];

teamArray = [];

  doInquirer(managerQuestions, 0);

  function doInquirer(newQuestions, roleInt){
      inquirer.prompt(newQuestions)
      .then(response => {
  
          if(roleInt == 0){
              var newManager = new Manager(response.newName, response.newId, response.newEmail, response.newOfficeNumber);
              teamArray.push(newManager);
          }
  
          if(roleInt == 1){
              var newEngineer = new Engineer(response.newName, response.newId, response.newEmail, response.newGithub);
              teamArray.push(newEngineer);
          }
  
          if(roleInt == 2){
              var newIntern = new Intern(response.newName, response.newId, response.newEmail, response.newSchool);
              teamArray.push(newIntern);
          }
  
  
  
  
  
          // teamArray.push(response);
          // console.log(response);
          if(response.doNext == "Done"){
              FinishedTeam(teamArray);
              // console.log("ALL DONE");
              // console.log(teamArray);
              // console.log(JSON.stringify(teamArray));
          }
          if(response.doNext == ("Add Engineer") || response.doNext == ("Add Another Engineer")){
              // console.log("Add Engineer");
              doInquirer(engineerQuestions, 1);
          }
          if(response.doNext == ("Add Intern") || response.doNext == ("Add Another Intern")){
              // console.log("Add Intern");
              doInquirer(internQuestions, 2);
          }
      });
  }