import * as chalk from "chalk";

export const log = (message: string) => {
    console.log(chalk.bgCyan(chalk.black('heathers-course-modifier:')) + ' ' + message);
    console.log('');
}