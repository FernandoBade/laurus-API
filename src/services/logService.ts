import { PrismaClient } from '@prisma/client';
import { TipoLog } from '../utils/enum';

const prisma = new PrismaClient();

export class LogService {
    static async registrarLog(tipo: TipoLog, mensagem: string) {
        await prisma.log.create({
            data: {
                tipo: tipo,
                mensagem,
            },
        });
    }
}