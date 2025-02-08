import { PrismaClient } from '@prisma/client';
import { TiposDeLog } from '../utils/enums';

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
}