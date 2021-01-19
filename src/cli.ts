#! /usr/bin/env node

import * as chalk from "chalk";
import logger from "./logger";
import { DiskHelper } from './diskHelper';
import { prompt } from "inquirer";
import { modifyCourse } from './driver';
import { config } from "dotenv";

config();

console.log(chalk.bgCyan.white('heathers-course-modifier starting...'));

const getArgs = async () => {
    let allCourses = await DiskHelper.getCourses();
    let answers: { idleTime: number, countDownTime: number, courseTotalTime: number, course: string } = await prompt([
        {
            type: 'number',
            name: 'idleTime',
            message: `specify course idle time (milliseconds)?`,
            default: 300000
        },
        {
            type: 'number',
            name: 'countDownTime',
            message: `specify course count down time (seconds)?`,
            default: 600
        },
        {
            type: 'number',
            name: 'courseTotalTime',
            message: `specify course duration time (seconds)?`,
            default: 600
        },
        {
            type: 'list',
            name: 'course',
            message: `choose a course to modify?`,
            choices: allCourses,
        }
    ]).catch(error => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else when wrong
        }
        logger.error(error);
    });

    logger.info('answers', answers);

    return answers;
}

const run = async () => {
    // await DiskHelper.ensureWorkingDirectory();

    //let course = await getArgs();

    // let extractedCourses = await DiskHelper.extractSelectedCourses([course]);

    // await modifyCourse(extractedCourses[0]);

    await modifyCourse('C:\\source\\heathers-course-modifier\\working\\writing-good-contracts-3-hours-scorm12-jkMEYrg-');
}

run().then(() => {
    console.log(chalk.bgCyan.white('heathers-course-modifier finished'));
});