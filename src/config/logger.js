import { createLogger, format, transports } from 'winston'


const formatLog = format.combine(
    format.colorize(),
    format.label({label: "BlogApp"}),
    format.json(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata()
)

let connectString = process.env.MONGOOSE_URL
const configLogMongoDB = new transports.MongoDB({
    level : "error",
    db : connectString,
    options:{
        ignoreUndefined: true,
        useUnifiedTopology: true
    },
    collection : "app-logs"
})

const logger = createLogger({
    level: 'info',
    transports : [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
        configLogMongoDB
    ],
    format : formatLog
})

if (process.env.NODE_ENV !== 'productions') {
    logger.add(new transports.Console({
        format: formatLog
    }))
}

export {
    logger
}
