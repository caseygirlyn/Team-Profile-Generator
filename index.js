const Employee = require("./lib/Employee.js");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// Gather information about the development team members and render the HTML file.

const teamMembers = [];

// Common questions for all employees with different roles.
const employeeQuestions = (team) => {
    const questions = [
        {
            type: "input",
            name: "name",
            message: `What is the ${team}'s name?`,
            validate(input) {
                return input.trim() !== '' ? true : `Please enter the ${team}'s name`;
            }

        },
        {
            type: "input",
            name: "id",
            message: `What is the ${team}'s id?`,
            validate(input) {
                return input.trim() !== '' ? true : `Please enter the ${team}'s id`;
            }
        },
        {
            type: "input",
            name: "email",
            message: `What is the ${team}'s email?`,
            validate(input) {
                const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex to validate email
                return validateEmail.test(input) ? true : 'Please enter a valid email address';
            },
        },
    ]

    // Additional question for different employee role 
    switch (team) {
        case 'manager':
            questions.push({
                type: "input",
                name: "officeNumber",
                message: `What is the ${team}'s office number?`,
                validate(input) {
                    return input.trim() !== '' ? true : `Please enter the ${team}'s office number`;
                }
            })
            break;
        case 'engineer':
            questions.push({
                type: "input",
                name: "github",
                message: `What is the ${team}'s GitHub username?`,
                validate(input) {
                    return input.trim() !== '' ? true : `Please enter the ${team}'s GitHub username`;
                }
            })
            break;
        case 'intern':
            questions.push({
                type: "input",
                name: "school",
                message: `What is the name of the ${team}'s school?`,
                validate(input) {
                    return input.trim() !== '' ? true : `Please enter name of the ${team}'s school`;
                }
            })
            break;
        default:
            break;
    }

    return inquirer.prompt(questions);
}

// Prompt user to add more team member or finish building the team
const addTeamMember = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "newMember",
            message: "Add a team member",
            choices: ["Engineer", "Intern", "Finish building the team"],
        }
    ]);
};

(async () => {
    try {
        const ansManager = await employeeQuestions('manager');
        const manager = new Manager(ansManager.name, ansManager.id, ansManager.email, ansManager.officeNumber); // Create an object for the manager
        teamMembers.push(manager); // Push information to teamMembers array

        let buildTeam = true;

        while (buildTeam) {
            const response = await addTeamMember();
            switch (response.newMember) {
                case 'Engineer':
                    const ansEngineer = await employeeQuestions('engineer');
                    const engineer = new Engineer(ansEngineer.name, ansEngineer.id, ansEngineer.email, ansEngineer.github); // Create an object for an engineer
                    teamMembers.push(engineer); // Push information to teamMembers array
                    break;
                case 'Intern':
                    const ansIntern = await employeeQuestions('intern');
                    const intern = new Intern(ansIntern.name, ansIntern.id, ansIntern.email, ansIntern.school); // Create an object for the intern
                    teamMembers.push(intern); // Push information to teamMembers array
                    break;
                default:
                    buildTeam = false;
                    break;
            }
        }

        // Generate the HTML displaying software engineering team profiles
        const outputTeam = render(teamMembers);
        fs.writeFileSync(outputPath, outputTeam); 

    } catch (error) {
        console.error(error);
    }
})();