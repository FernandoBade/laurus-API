import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UsuarioService {
    static async criarUsuario(dados: any) {
        dados.email = dados.email.trim().toLowerCase();
        const senhaHash = await bcrypt.hash(dados.senha, 10);

        return prisma.usuario.create({
            data: { ...dados, senha: senhaHash },
        });
    }

    static async listarUsuarios() {
        return prisma.usuario.findMany();
    }

    static async obterUsuarioPorId(id: string) {
        return prisma.usuario.findUnique({ where: { id } });
    }

    static async obterUsuariosPorNome(nome: string) {
        const nomeLower = nome.toLowerCase();
        return prisma.usuario.findMany({
            where: {
                nome: {
                    contains: nomeLower
                }
            }
        });
    }

    static async obterUsuarioPorEmail(email: string) {
        return prisma.usuario.findUnique({ where: { email } });
    }

    static async atualizarUsuario(id: string, dados: any) {
        if (dados.senha) dados.senha = await bcrypt.hash(dados.senha, 10);

        return prisma.usuario.update({
            where: { id },
            data: dados,
        });
    }

    static async excluirUsuario(id: string) {
        return prisma.usuario.delete({ where: { id } });
    }
}
