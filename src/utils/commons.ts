import { createLogger, format, transports, addColors } from 'winston';
import { NextFunction } from 'express';
import { LogService } from '../services/logService';
import { TipoLog } from './enum';

//#region 🔹 Logger

const customLevels = {
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        notice: 3,
    },
    colors: {
        error: 'red',
        warning: 'yellow',
        info: 'green',
        notice: 'grey',
    },
};

addColors(customLevels.colors);

const winstonLogger = createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.timestamp({ format: 'ISO8601' }),
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
        })
    ],
});

const tipoLogParaNivel: Record<TipoLog, string> = {
    [TipoLog.ERRO]: 'error',
    [TipoLog.ALERTA]: 'warning',
    [TipoLog.SUCESSO]: 'info',
    [TipoLog.NOTIFICACAO]: 'notice',
};

const nivelParaTipoLog: Record<string, TipoLog> = {
    'error': TipoLog.ERRO,
    'warning': TipoLog.ALERTA,
    'info': TipoLog.SUCESSO,
    'notice': TipoLog.NOTIFICACAO,
};

/**
 * Registra uma mensagem de log com o tipo especificado.
 *
 * @param tipo - O tipo de log a ser registrado (e.g., TipoLog.ERRO, TipoLog.SUCESSO).
 * @param mensagem - A mensagem de log a ser registrada.
 *
 * Este método utiliza o `winstonLogger` para registrar a mensagem no console
 * e também chama o `LogService` para persistir o log de forma assíncrona.
 */
export async function registrarLog(tipo: TipoLog, mensagem: string) {
    const nivel = tipoLogParaNivel[tipo];
    winstonLogger.log(nivel, mensagem);
    const tipoParaBanco = nivelParaTipoLog[nivel as keyof typeof nivelParaTipoLog];
    await LogService.registrarLog(tipoParaBanco, mensagem);
};

/**
 * Trata um erro registrando-o e passando-o para o próximo middleware.
 *
 * @param erro - O erro a ser tratado, que pode ser uma instância de `Error` ou outro tipo desconhecido.
 * @param mensagem - Uma mensagem adicional para contextualizar o erro.
 * @param next - A função `NextFunction` do Express para passar o erro adiante.
 *
 * Este método registra o erro usando `registrarLog` com o tipo `TipoLog.ERRO`
 * e inclui a mensagem de erro original, se disponível. Em seguida, chama `next`
 * para continuar o fluxo de middleware do Express.
 */
export async function tratarErro(erro: unknown, mensagem: string, next: NextFunction) {
    const mensagemErro = (erro instanceof Error) ? erro.message : 'Erro desconhecido';
    await registrarLog(TipoLog.ERRO, `${mensagem}: ${mensagemErro}`);
    next(erro);
};

// #endregion 🔹 Logger
