import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LogService {
    static async registrarLog(nivel: string, mensagem: string) {
        await prisma.log.create({
            data: {
                nivel,
                mensagem,
            },
        });
    }
}