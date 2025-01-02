const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Custom format for better readability
const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
    })
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '14d'
        }),
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '14d',
            level: 'error'
        })
    ]
});

// Export a wrapper with common logging patterns
module.exports = {
    info: (message, meta = {}) => logger.info(message, meta),
    error: (message, error = null) => {
        const meta = error ? {
            error: {
                message: error.message,
                stack: error.stack,
                ...error
            }
        } : {};
        logger.error(message, meta);
    },
    warn: (message, meta = {}) => logger.warn(message, meta),
    debug: (message, meta = {}) => logger.debug(message, meta),
    http: (message, meta = {}) => logger.http(message, meta)
};