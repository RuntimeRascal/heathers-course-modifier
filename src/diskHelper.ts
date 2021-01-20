import { readdir, ensureDir, emptyDir, pathExistsSync } from "fs-extra";
import logger, { log } from "./logger";
import * as extract from "extract-zip";
import { join } from "path";
import * as chalk from "chalk";

export class DiskHelper {
    static getCourses = async () => {
        let courses = [];
        if (process.env.COURSE_DIR_PATH && process.env.COURSE_DIR_PATH !== '' && pathExistsSync(process.env.COURSE_DIR_PATH)) {
            courses = await readdir(process.env.COURSE_DIR_PATH);
        } else
            courses = await readdir(join(__dirname, '..\\', 'courses'));
        return courses;
    }

    static ensureWorkingDirectory = async () => {
        let path = join(__dirname, '..\\', 'working');
        await ensureDir(path);
        await emptyDir(path);
        log(`ensured '${chalk.gray(path)}' exists`);
    };

    static ensureModifiedCoursesDirectory = async () => {
        let path = join(__dirname, '..\\', 'modified-courses');
        if (process.env.COURSE_DIR_PATH && process.env.COURSE_DIR_PATH !== '' && pathExistsSync(process.env.COURSE_DIR_PATH)) {
            path = join(process.env.COURSE_DIR_PATH, 'modified-courses');
        }
        await ensureDir(path);
        await emptyDir(path);
        log(`ensured '${chalk.gray(path)}' exists`);
        return path;
    };

    static extractSelectedCourses = async (courses: string[]) => {
        let extractedCourses: string[] = [];
        for (let index = 0; index < courses.length; index++) {
            const course = courses[index];
            let coursePath = join(__dirname, '..\\', 'courses', course);
            let extractPath = join(__dirname, '..\\', 'working', course.replace('.zip', ''));

            if (!coursePath.endsWith('.zip')) {
                console.error(`path to course does not appear to be a archive or zip file. ${JSON.stringify({ path: coursePath })}`);
                continue;
            }

            if (!pathExistsSync(coursePath)) {
                console.error(`path to course does not exist. ${JSON.stringify({ path: coursePath })}`);
                continue;
            }

            try {
                log(`unzipping course: '${chalk.gray(coursePath)}'`);
                await extract(coursePath, { dir: extractPath });
                log(`finished unzipping course to: '${chalk.gray(extractPath)}'`);
                extractedCourses.push(extractPath);
            } catch (error) {
                console.error(`error while trying to unzip course`, error);
            }
        }
        return extractedCourses;
    };
}