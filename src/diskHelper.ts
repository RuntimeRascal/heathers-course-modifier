import { readdir, ensureDir, emptyDir, pathExistsSync } from "fs-extra";
import logger from "./logger";
import * as extract from "extract-zip";
import { join } from "path";

export class DiskHelper {
    static getCourses = async () => {
        let courses = await readdir(join(__dirname, '..\\', 'courses'));
        logger.info('got list of all courses from folder', courses);
        return courses;
    }

    static ensureWorkingDirectory = async () => {
        let path = join(__dirname, '..\\', 'working');
        await ensureDir(path);
        await emptyDir(path);
        logger.info(`ensured '${path}' exists`);
    };

    static extractSelectedCourses = async (courses: string[]) => {
        let extractedCourses: string[] = [];
        for (let index = 0; index < courses.length; index++) {
            const course = courses[index];
            let coursePath = join(__dirname, '..\\', 'courses', course);
            let extractPath = join(__dirname, '..\\', 'working', course.replace('.zip', ''));

            if (!coursePath.endsWith('.zip')) {
                logger.error('path to course does not appear to be a archive or zip file.', { path: coursePath });
                continue;
            }

            if (!pathExistsSync(coursePath)) {
                logger.error('path to course does not exist.', { path: coursePath });
                continue;
            }

            try {
                logger.info('unzipping course', { course: coursePath });
                await extract(coursePath, { dir: extractPath });
                logger.info('finished unzipping course', { course: extractPath })
                extractedCourses.push(extractPath);
            } catch (error) {
                logger.error('error while trying to unzip course', error);
            }
        }
        return extractedCourses;
    };
}