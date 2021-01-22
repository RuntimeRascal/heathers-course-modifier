import { readdir, ensureDir, emptyDir, pathExistsSync } from "fs-extra";
import { logInfo } from "./logger";
import * as extract from "extract-zip";
import { join } from "path";
import * as chalk from "chalk";
import { ISettings } from './cli';
import * as zipdir from "zip-dir";

export class DiskHelper {
    static getCourses = async () => {
        let dir = '';
        if (process.env.COURSE_DIR_PATH && process.env.COURSE_DIR_PATH !== '' && pathExistsSync(process.env.COURSE_DIR_PATH)) {
            dir = process.env.COURSE_DIR_PATH;
        } else
            dir = join(__dirname, '..\\', 'courses');

        let contents = await readdir(dir);
        let allZips = contents.filter(c => c.endsWith('.zip'));
        return { courses: allZips, coursesDirectory: dir };
    }

    static ensureWorkingDirectory = async (settings: ISettings) => {
        let path = join(__dirname, '..\\', 'working');
        await ensureDir(path);
        await emptyDir(path);
        logInfo(`ensured '${chalk.gray(path)}' exists`);
        settings.paths.workingDirectory = path;
    };

    static ensureModifiedCoursesDirectory = async (settings: ISettings) => {
        let path = join(__dirname, '..\\', 'modified-courses');
        if (process.env.COURSE_DIR_PATH && process.env.COURSE_DIR_PATH !== '' && pathExistsSync(process.env.COURSE_DIR_PATH)) {
            path = join(process.env.COURSE_DIR_PATH, 'modified-courses');
        }
        await ensureDir(path);
        await emptyDir(path);
        logInfo(`ensured '${chalk.gray(path)}' exists`);
        settings.paths.modifiedDirectory = path;

    };

    static extractSelectedCourse = async (settings: ISettings) => {
        await DiskHelper.ensureWorkingDirectory(settings);

        const course = settings.course;
        settings.paths.originalCourse = join(settings.paths.coursesDirectory, course);
        settings.paths.extractedCourse = join(settings.paths.workingDirectory, course.replace('.zip', ''));

        if (!settings.paths.originalCourse.endsWith('.zip')) {
            console.error(`path to course does not appear to be a archive or zip file. ${JSON.stringify({ path: settings.paths.originalCourse })}`);
            return;
        }

        if (!pathExistsSync(settings.paths.originalCourse)) {
            console.error(`path to course does not exist. ${JSON.stringify({ path: settings.paths.originalCourse })}`);
            return;
        }

        try {
            logInfo(`unzipping course: '${chalk.gray(settings.paths.originalCourse)}'`);
            await extract(settings.paths.originalCourse, { dir: settings.paths.extractedCourse });
            logInfo(`finished unzipping course to: '${chalk.gray(settings.paths.extractedCourse)}'`);
        } catch (error) {
            console.error(`error while trying to unzip course`, error);
        }
    };

    static archiveSelectedCourse = async (settings: ISettings) => {
        await DiskHelper.ensureModifiedCoursesDirectory(settings);
        settings.paths.modifiedCourse = join(settings.paths.modifiedDirectory, settings.course);
        logInfo(`archiving modified course: '${chalk.gray(settings.paths.modifiedCourse)}'`);

        return new Promise<void>((resolve) => {
            zipdir(settings.paths.extractedCourse, { saveTo: settings.paths.modifiedCourse }, function (err, buffer) {
                logInfo(`finished archiving modified course: '${chalk.gray(settings.paths.modifiedCourse)}'`);
                resolve();
            });
        });
    }
}