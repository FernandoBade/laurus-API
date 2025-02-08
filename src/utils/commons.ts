import { createLogger, format, transports, addColors } from 'winston';
import { NextFunction } from 'express';
import { LogService } from '../services/logService';
import { HTTPStatus, TiposDeLog } from './enums';
import { Response } from 'express';

//#region 🔹 Logger
const logsCustomizados = {
    levels: {
        [TiposDeLog.ERRO]: 0,
        [TiposDeLog.ALERTA]: 1,
        [TiposDeLog.SUCESSO]: 2,
        [TiposDeLog.INFO]: 3,
        [TiposDeLog.DEBUG]: 4
    },

    colors: {
        [TiposDeLog.ERRO]: 'red',
        [TiposDeLog.ALERTA]: 'yellow',
        [TiposDeLog.SUCESSO]: 'green',
        [TiposDeLog.INFO]: 'blue',
        [TiposDeLog.DEBUG]: 'magenta'
    }
};

addColors(logsCustomizados.colors);

const logger = createLogger({
    levels: logsCustomizados.levels,
    format: format.combine(
        format.timestamp(),
        format.colorize({ all: true }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console({
            level: TiposDeLog.DEBUG,
        })
    ]
});

/**
 * Registra uma mensagem de log.
 *
 * @param tipo - Tipo de log (ERRO, ALERTA, SUCESSO, INFO, DEBUG).
 * @param mensagem - Mensagem a ser registrada.
 *
 * Usa o `logger` para mostrar no console e o `LogService` para salvar. O nível DEBUG não é salvo.
 */

export async function registrarLog(tipo: TiposDeLog, mensagem: string) {
    logger.log(tipo, mensagem);
    await LogService.registrarLog(tipo, mensagem);
}

// #endregion 🔹 Logger

// #region 🔹 Tratamentos gerais de respostas e erros
/**
 * Lida com um erro, registrando no banco e passando adiante.
 *
 * @param erro - O erro que ocorreu.
 * @param mensagem - Mensagem extra para contexto.
 * @param next - Função do Express para continuar o fluxo.
 *
 * Registra o erro com `registrarLog` e chama `next` para seguir o baile.
 */
export async function tratarErro(mensagem: string, erro: unknown, next: NextFunction) {
    const mensagemErro = (erro instanceof Error) ? erro.message : 'Erro desconhecido';
    await registrarLog(TiposDeLog.ERRO, `${mensagem}: ${mensagemErro}`);
    next(new Error(mensagemErro));
}

/**
 * Responde a uma requisição com uma estrutura padrão.
 *
 * @param res - O objeto de resposta do Express.
 * @param status - O código de status HTTP.
 * @param dados - Os dados a serem retornados (opcional).
 * @param mensagem - A mensagem a ser retornada (opcional).
 */
export function responderAPI(res: Response, status: HTTPStatus, dados?: any, mensagem?: string) {
    let response: any = {
        sucesso: status === HTTPStatus.OK || status === HTTPStatus.CREATED,
        mensagem: mensagem || (status === HTTPStatus.OK || status === HTTPStatus.CREATED
            ? 'Requisição realizada com sucesso.'
            : 'Ocorreu um erro na requisição'),
        dados: dados ?? null, 
    };

    try {
        console.log('🔹 Dados a serem enviados na resposta:', response.dados);
        response.dados = JSON.parse(JSON.stringify(response.dados));
    } catch (error) {
        console.error('❌ Erro ao serializar dados para resposta:', error);
        response.dados = null;
    }

    if (!res.headersSent) {
        return res.status(status).json(response);
    } else {
        console.warn("⚠️ Tentativa de enviar uma resposta depois dos headers já enviados.");
    }
}

// #endregion 🔹 Tratamentos gerais de respostas e erros
