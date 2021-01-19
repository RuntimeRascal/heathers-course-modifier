
import { createLogger, transports, format } from "winston";

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


export default logger;