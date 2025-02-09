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
        try {
            return prisma.usuario.findMany();
        } catch (erro) {
            return { erro: "Erro ao listar usuários" };
        }
    }

    static async obterUsuarioPorId(id: string) {
        try {
            return prisma.usuario.findUnique({ where: { id } });
        } catch (erro) {
            return { erro: "Erro ao obter usuário por ID" };
        }
    }

    static async obterUsuariosPorEmail(emailTermo?: string) {
        try {
            const where: any = {
                email: { contains: emailTermo },
            };

            const usuarios = await prisma.usuario.findMany({ where });
            return { total: usuarios?.length ?? null, usuarios: usuarios ?? [] };

        } catch (erro) {
            return { erro: "Erro ao obter usuários por e-mail" };
        }
    }

    static async atualizarUsuario(id: string, dadosParaAtualizar: any) {
        try {
            const usuarioExistente = await prisma.usuario.findUnique({
                where: { id },
            });

            if (!usuarioExistente) {
                return { erro: "Usuário não encontrado" };
            }

            const usuarioAtualizado = await prisma.usuario.update({
                where: { id },
                data: {
                    ...dadosParaAtualizar,
                },
            });

            return usuarioAtualizado;

        } catch (erro) {
            return { erro: "Erro ao atualizar usuário" };
        }
    }

    static async excluirUsuario(id: string) {
        try {
            const usuarioExistente = await prisma.usuario.findUnique({
                where: { id },
            });

            if (!usuarioExistente) {
                return { erro: "Usuário não encontrado" };
            }
            const usuarioExcluidoId = usuarioExistente.id;
            const usuarioExcluido = await prisma.usuario.delete({
                where: { id },
            });

            return { id: usuarioExcluidoId };

        } catch (erro) {
            return { erro: "Erro ao excluir usuário" };
        }
    }
}
