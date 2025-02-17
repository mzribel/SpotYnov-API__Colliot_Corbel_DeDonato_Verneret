import { createLogger, format, transports } from 'winston';

const log_format = format.combine(
    format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
    format.printf(({ level, message, timestamp, }) => {
        return `[ ${level.toUpperCase()} || ${timestamp} || LOG: "${message}" ]`;
    })
)

const logger = createLogger({
    level: 'info',
    format: log_format,
    transports: [
        new transports.File({ filename: 'logs/app.log' }),
        new transports.Console()
    ]
});
export default logger;