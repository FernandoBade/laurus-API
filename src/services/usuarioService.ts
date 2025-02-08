import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { criarUsuarioSchema } from '../utils/validator';

const prisma = new PrismaClient();
export class UsuarioService {
    static async cadastrarUsuario(dados: any) {
        try {
            dados.email = dados.email.trim().toLowerCase();
            const usuarioExistente = await prisma.usuario.findUnique({
                where: { email: dados.email },
            });

            if (usuarioExistente) {
                throw new Error('O e-mail já está em uso. Por favor, escolha outro.');
            }

            const senhaCrypto = await bcrypt.hash(dados.senha, 10);
            return await prisma.usuario.create({
                data: {
                    ...dados,
                    senha: senhaCrypto,
                },
            });
        } catch (erro) {
            throw new Error('Erro ao criar usuário. Verifique os dados fornecidos.');
        }
    }

    static async listarUsuarios() {
        return prisma.usuario.findMany();
    }

    static async obterUsuarioPorId(id: string) {
        return prisma.usuario.findUnique({ where: { id } });
    }

    static async obterUsuariosPorEmail(emailTermo?: string) {
        const where: any = {};

        if (emailTermo) {
            where.email = {
                contains: emailTermo,
                mode: 'insensitive'
            };
        }

        const usuarios = await prisma.usuario.findMany({
            where,
        });

        if (usuarios.length === 0) {
            throw new Error('Nenhum usuário encontrado com o e-mail fornecido.');
        }

        return usuarios;
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
        return prisma.usuario.delete({ where: { id } });
    }


}
