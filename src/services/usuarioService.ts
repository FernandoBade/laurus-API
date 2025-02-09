import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
export class UsuarioService {
    static async cadastrarUsuario(dados: any) {
        try {
            dados.email = dados.email.trim().toLowerCase();
            const usuarioExistente = await prisma.usuario.findUnique({
                where: { email: dados.email },
            });

            if (usuarioExistente) {
                return { erro: "O e-mail já está em uso", dados: dados };
            }

            const senhaCrypto = await bcrypt.hash(dados.senha, 10);
            const novoUsuario = await prisma.usuario.create({
                data: {
                    ...dados,
                    senha: senhaCrypto,
                },
            });

            return novoUsuario;
        } catch (erro) {
            return { erro: "Erro ao criar usuário" };
        }
    }


    static async listarUsuarios() {
        return prisma.usuario.findMany();
    }

    static async obterUsuarioPorId(id: string) {
        return prisma.usuario.findUnique({ where: { id } });
    }

    static async obterUsuariosPorEmail(emailTermo?: string) {
        const where: any = {
            email: { contains: emailTermo },
        };

        const usuarios = await prisma.usuario.findMany({ where });
        return usuarios ?? [];
    }


    static async atualizarUsuario(id: string, dadosParaAtualizar: any) {
        return prisma.usuario.update({
            where: { id },
            data: {
                ...dadosParaAtualizar,
            },
        });
    }

    static async excluirUsuario(id: string) {
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id },
        });

        if (!usuarioExistente) {
            return { erro: "Usuário não encontrado" };
        }

        await prisma.usuario.delete({
            where: { id },
        });

    }



}
