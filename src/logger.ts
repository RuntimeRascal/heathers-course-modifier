import * as chalk from "chalk";

export const logInfo = (message: string) => {
    console.log(chalk.green(chalk.italic('heathers-course-modifier')) + ' \n\t✨ ' + chalk.italic.gray(message));
    console.log('');
}
export const logImp = (message: string) => {
    console.log(chalk.bgBlue('⭐ ' + message + ' ⭐'));
    console.log('');
}

export const logMod = (message: string) => {
    console.log(chalk.green(chalk.italic('heathers-course-modifier')) + '\n\t✨ ' + chalk.magenta(' applying mod') + ' ' + chalk.bold(message));
    console.log('');
}