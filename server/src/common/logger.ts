import winston from "winston";

const timezoned = () => {
    return new Date().toLocaleString('cs-CZ', {
        timeZone: 'Europe/Prague'
    });
}

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({format: timezoned}),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "error.log"
        })
    ]
});

export function getLogger() {
    return logger;
}
