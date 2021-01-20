#! /usr/bin/env node

import * as chalk from "chalk";
import { log } from "./logger";
import { DiskHelper } from './diskHelper';
import { prompt } from "inquirer";
import { modifyCourse } from './driver';
import { config } from "dotenv";

config();

log('starting...');

export interface ISettings {
    idleTime: number; countDownTime: number; courseTotalTime: number; course: string;
    paths?: {
        extractedCourse?: string,
        modifiedCourse?: string,
        originalCourse?: string
        coursesDirectory?: string
        workingDirectory?: string
        modifiedDirectory?: string
    }
}


const getArgs = async () => {
    let { courses, coursesDirectory } = await DiskHelper.getCourses();
    let answers = await prompt([
        {
            type: 'number',
            name: 'idleTime',
            message: `specify course idle time in ${chalk.bgYellow.black('milliseconds')}?`,
            default: process.env.DEFAULT_IDLE_TIME && process.env.DEFAULT_IDLE_TIME != '' ? +process.env.DEFAULT_IDLE_TIME : 300000
        },
        {
            type: 'number',
            name: 'countDownTime',
            message: `specify course count down time in ${chalk.bgYellow.black('seconds')}?`,
            default: process.env.DEFAULT_COUNTDOWN_TIME && process.env.DEFAULT_COUNTDOWN_TIME != '' ? +process.env.DEFAULT_COUNTDOWN_TIME : 600
        },
        {
            type: 'number',
            name: 'courseTotalTime',
            message: `specify course duration time in ${chalk.bgYellow.black('seconds')}?`,
            default: process.env.DEFAULT_COURSE_TOTAL_TIME && process.env.DEFAULT_COURSE_TOTAL_TIME != '' ? +process.env.DEFAULT_COURSE_TOTAL_TIME : 600
        },
        {
            type: 'list',
            name: 'course',
            message: `choose a course to modify?`,
            choices: courses,
        }
    ]).catch(error => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else when wrong
        }

        console.error(error);
    });

    let settings: ISettings = {
        ...answers, paths: {
            extractedCourse: '',
            modifiedCourse: '',
            originalCourse: '',
            coursesDirectory: coursesDirectory,
            modifiedDirectory: '',
            workingDirectory: ''
        }
    }

    log(`You entered the following: ${chalk.gray(JSON.stringify(answers))}`);

    return settings;
}

const run = async () => {
    // let settings: ISettings = {
    //     countDownTime: 600, courseTotalTime: 600, idleTime: 600000,
    //     course: 'writing-good-contracts-3-hours-scorm12-jkMEYrg-',
    //     paths: {
    //         coursesDirectory: 'C:\\source\\heathers-course-modifier\\courses',
    //         workingDirectory: 'C:\\source\\heathers-course-modifier\\working',
    //         modifiedDirectory: 'C:\\source\\heathers-course-modifier\\modified-courses',
    //         originalCourse: 'C:\\source\\heathers-course-modifier\\courses\\writing-good-contracts-3-hours-scorm12-jkMEYrg-.zip',
    //         extractedCourse: 'C:\\source\\heathers-course-modifier\\working\\writing-good-contracts-3-hours-scorm12-jkMEYrg-',
    //         modifiedCourse: 'C:\\source\\heathers-course-modifier\\modified-courses\\writing-good-contracts-3-hours-scorm12-jkMEYrg-.zip',
    //     }
    // }
    let settings = await getArgs();

    await DiskHelper.extractSelectedCourse(settings);

    await modifyCourse(settings);

    //await DiskHelper.archiveSelectedCourse(settings);
}

run().then(() => {
    log(`Script Complete. Exiting!`);
});