import { PrismaClient } from '@prisma/client';
import { TiposDeLog } from '../utils/enums';
import { registrarLog } from '../utils/commons';

const prisma = new PrismaClient();

export class LogService {
    static async registrarLog(tipo: TiposDeLog, mensagem: string) {
        if (tipo !== TiposDeLog.DEBUG) {
            await prisma.log.create({
                data: {
                    tipo: tipo,
                    mensagem,
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

        registrarLog(TiposDeLog.INFO, `Total de logs deletados: ${resultado.count}`);
        return resultado.count;
    }
}