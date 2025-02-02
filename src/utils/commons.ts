import path from 'path';
import { Response } from 'express';
import { createLogger, format, transports, addColors } from 'winston';

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
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
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
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'notice',
            format: format.combine(
                format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
            ),
        }),
    ],
});

//#region 🔹 Resposta Padrão da API
export function responderAPI(
    res: Response,
    status: number,
    mensagem: string,
    dados: any = null
) {
    const resposta: any = { mensagem };
    if (dados) resposta.dados = Array.isArray(dados) ? { total: dados.length, resultados: dados } : dados;

    res.status(status).json(resposta);
}
//#endregion Resposta API