import { PrismaClient } from '@prisma/client';
import { TiposDeLog, Operacoes } from '../utils/enums';
import { registrarLog } from '../utils/commons';

const prisma = new PrismaClient();

export class LogService {
    static async registrarLog(tipo: TiposDeLog, operacao: Operacoes, detalhe: string, usuarioId?: string) {
        if (tipo !== TiposDeLog.DEBUG) {
            await prisma.log.create({
                data: {
                    tipo: tipo,
                    operacao,
                    detalhe,
                    usuarioId,
                },
            });
        }
    }

    static async esvaziarLogsAntigos() {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - 120);

        const resultado = await prisma.log.deleteMany({
            where: {
                timestamp: {
                    lt: dataLimite,
                },
            },
        });

        registrarLog(
            TiposDeLog.INFO,
            Operacoes.EXCLUSAO,
            `Total de logs deletados: ${resultado.count}`
        );
        return resultado.count;
    }

    static async buscarLogsPorUsuario(usuarioId: string) {
        return await prisma.log.findMany({
            where: {
                usuarioId: usuarioId,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
    }
}