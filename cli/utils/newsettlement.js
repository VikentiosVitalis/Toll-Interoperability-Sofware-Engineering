module.exports = { newsettlement: newsettlement };

const inquirer = require("inquirer");
const axios = require('axios');

async function promptMissingOperator() {
    const question = [];

    question.push({
        type: 'input',
        name: 'operator',
        message: 'Please type an operator of your choice',
    });

    const answer = await inquirer.prompt(question);
    return answer.operator;
}

async function promptMissingDateTo() {
    const question = [];

    question.push({
        type: 'input',
        name: 'DateTo',
        message: 'Type the latest date of pass records to be fetched in YYYYMMDD format',
    });

    const answer = await inquirer.prompt(question);
    return answer.DateTo;
}

async function newsettlement(baseURL, token, op1, op2, dateto) {
    let res;

    if (op1 == undefined) {
        console.log("Operator one is missing");
        op1 = await promptMissingOperator();
    }
    if (op2 == undefined) {
        console.log("Operator two is missing");
        op2 = await promptMissingOperator();
    }
    if (dateto == undefined) {
        console.log("dateto is missing");
        dateto = await promptMissingDateTo();
    }

    await axios.post(`${baseURL}/NewSettlement`, { op1_ID: `${op1}`, op2_ID: `${op2}`, date_to: `${dateto}` }, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: NewSettlement");
        res = error.response.status;
    });

    return res;
}
