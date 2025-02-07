import path from 'path';
import { createLogger, format, transports, addColors } from 'winston';
import { NextFunction } from 'express';
import { LogService } from '../services/logService';

//#region 🔹 Logger
const logPath = path.join(__dirname, './logs/');

const customLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        success: 5,
        info: 6,
        notice: 7,
    },
    colors: {
        emerg: 'magenta',
        alert: 'grey bold',
        crit: 'red',
        error: 'red bold',
        warning: 'yellow bold',
        success: 'green bold',
        info: 'green bold',
        notice: 'grey',
    },
};

addColors(customLevels.colors);

export const logger = createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ssZ' }),
        format.json(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console({
            level: 'notice',
            format: format.combine(
                format.colorize({ all: true }),
                format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
            )
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logPath}/laurus-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'notice',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ssZ' }),
                format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
            ),
        }),
    ],
});

export async function tratarErro(erro: unknown, mensagem: string, next: NextFunction) {
    const mensagemErro = (erro instanceof Error) ? erro.message : 'Erro desconhecido';
    logger.error(`${mensagem}: ${mensagemErro}`);

    await LogService.registrarLog('error', `${mensagem}: ${mensagemErro}`);

    next(erro);
}