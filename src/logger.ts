
import { createLogger, transports, format } from "winston";
import * as chalk from "chalk";

const logger = createLogger({
    transports: [new transports.Console()],
    defaultMeta: { service: 'heathers-course-modifier' },
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.colorize({ all: true }),
        format.simple()
    )
});

export const log = (message: string) => {
    console.log(chalk.bgCyan(chalk.black('heathers-course-modifier:')) + ' ' + message);
}

export default logger;