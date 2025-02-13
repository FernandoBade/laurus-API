import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { registrarLog, responderAPI } from '../utils/commons';
import { HTTPStatus, Operacoes, TiposDeLog } from '../utils/enums';
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../utils/validator';

class UsuarioController {
    static async criarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const dadosUsuario = req.body;
            const resultadoParse = criarUsuarioSchema.safeParse(dadosUsuario);

            if (!resultadoParse.success) {
                const mensagensDeErro = resultadoParse.error.errors.map(err => err.message.replace(/"/g, "'"));
                return responderAPI(res, HTTPStatus.BAD_REQUEST, { erros: mensagensDeErro });
            }

            const resultado = await UsuarioService.criarUsuario(resultadoParse.data);

            if (resultado && 'erro' in resultado) {
                return responderAPI(
                    res,
                    HTTPStatus.BAD_REQUEST,
                    resultado.dados.email ?? undefined,
                    resultado.erro ?? undefined);
            }

            responderAPI(res, HTTPStatus.CREATED, resultado);
            await registrarLog(
                TiposDeLog.SUCESSO,
                Operacoes.CRIACAO,
                JSON.stringify(resultadoParse.data),
                resultado.id
            );

        } catch (erro) {
            await registrarLog(
                TiposDeLog.ERRO,
                Operacoes.CRIACAO,
                JSON.stringify(erro),
                req.body?.usuarioId,
                next
            );
        }
    }

    static async listarUsuarios(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.listarUsuarios();
            responderAPI(res, HTTPStatus.OK, usuarios);

        } catch (erro) {
            await registrarLog(
                TiposDeLog.ERRO,
                Operacoes.BUSCA,
                JSON.stringify(erro),
                undefined,
                next
            );
        }
    }

    static async obterUsuarioPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioService.obterUsuarioPorId(id);

            if (!usuario) {
                return responderAPI(res, HTTPStatus.BAD_REQUEST, id ?? undefined, "Usuário não encontrado");
            }
            responderAPI(res, HTTPStatus.OK, usuario);

        } catch (erro) {
            await registrarLog(
                TiposDeLog.ERRO,
                Operacoes.BUSCA,
                JSON.stringify(erro),
                req.params.id,
                next
            );
        }
    }

    static async obterUsuariosPorEmail(emailTermo: string, req: Request, res: Response, next: NextFunction) {
        try {
            if (!emailTermo || emailTermo.length < 3) {
                return responderAPI(res, HTTPStatus.BAD_REQUEST, [], "O termo de busca deve ter pelo menos 3 caracteres");
            }

            const usuarios = await UsuarioService.obterUsuariosPorEmail(emailTermo);

            if (!usuarios.total) {
                return responderAPI(res, HTTPStatus.BAD_REQUEST, [], "Nenhum usuário encontrado");
            }

            return responderAPI(res, HTTPStatus.OK, usuarios);

        } catch (erro) {
            await registrarLog(
                TiposDeLog.ERRO,
                Operacoes.BUSCA,
                JSON.stringify(erro),
                undefined,
                next
            );
        }
    }

    static async atualizarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const dadosAtualizados = req.body;

            const parseResult = atualizarUsuarioSchema.safeParse(dadosAtualizados);
            if (!parseResult.success) {
                const mensagensDeErro = parseResult.error.errors.map(err => err.message.replace(/"/g, "'"));
                return responderAPI(res, HTTPStatus.BAD_REQUEST, { erros: mensagensDeErro });
            }

            const { ...dadosParaAtualizar } = parseResult.data;

            const usuarioAtualizado = await UsuarioService.atualizarUsuario(req.params.id, dadosParaAtualizar);

            if (!usuarioAtualizado) {
                return responderAPI(res, HTTPStatus.BAD_REQUEST, { mensagem: "Usuário não encontrado" });
            }

            responderAPI(res, HTTPStatus.OK, usuarioAtualizado);
            await registrarLog(
                TiposDeLog.SUCESSO,
                Operacoes.ATUALIZACAO,
                JSON.stringify(dadosAtualizados),
                req.params.id
            );
        } catch (erro) {
            await registrarLog(
                TiposDeLog.ERRO,
                Operacoes.ATUALIZACAO,
                JSON.stringify(erro),
                req.params.id,
                next
            );
        }
    }

    static async excluirUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await UsuarioService.excluirUsuario(req.params.id);

            if (resultado && 'erro' in resultado) {
                return responderAPI(res, HTTPStatus.BAD_REQUEST, resultado, "Erro ao excluir usuário");
            }

            responderAPI(res, HTTPStatus.OK, resultado ?? undefined, "Usuário excluído com sucesso");
            await registrarLog(
                TiposDeLog.SUCESSO,
                Operacoes.EXCLUSAO,
                JSON.stringify(resultado),
                undefined
            );

        } catch (erro) {
            await registrarLog(
                TiposDeLog.ERRO,
                Operacoes.EXCLUSAO,
                JSON.stringify(erro),
                req.params.id,
                next
            );
        }
    }
}

export default UsuarioController;