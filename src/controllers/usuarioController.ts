import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { registrarLog, tratarErro, responderAPI } from '../utils/commons';
import { HTTPStatus, TiposDeLog } from '../utils/enums';
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../utils/validator';

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const dadosUsuario = req.body;
            const parseResult = criarUsuarioSchema.safeParse(dadosUsuario);

            if (!parseResult.success) {
                const mensagensDeErro = parseResult.error.errors.map(err => err.message.replace(/"/g, "'"));
                return responderAPI(res, HTTPStatus.BAD_REQUEST, { erros: mensagensDeErro });
            }

            const resultado = await UsuarioService.cadastrarUsuario(parseResult.data);

            if (resultado && 'erro' in resultado) {
                return responderAPI(
                    res,
                    HTTPStatus.BAD_REQUEST,
                    resultado.dados.email ?? undefined,
                    resultado.erro ?? undefined);
            }

            responderAPI(res, HTTPStatus.CREATED, resultado);
            await registrarLog(TiposDeLog.SUCESSO, `Usuário cadastrado: ${JSON.stringify(parseResult.data)}`);

        } catch (erro) {
            tratarErro('Erro ao cadastrar usuário', erro, next);
        }
    }

    static async listarUsuarios(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.listarUsuarios();
            responderAPI(res, HTTPStatus.OK, usuarios);

        } catch (erro) {
            tratarErro('Erro ao listar usuários', erro, next);
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
            tratarErro('Erro ao obter usuário por ID', erro, next);
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
            tratarErro('Erro ao buscar usuários', erro, next);
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

            const { id, ...dadosParaAtualizar } = parseResult.data;
            const usuarioAtualizado = await UsuarioService.atualizarUsuario(id, dadosParaAtualizar);

            if (!usuarioAtualizado) {
                return responderAPI(res, HTTPStatus.BAD_REQUEST, { mensagem: "Usuário não encontrado" });
            }

            responderAPI(res, HTTPStatus.OK, usuarioAtualizado);
            await registrarLog(TiposDeLog.INFO, `Usuário atualizado: ${JSON.stringify(dadosAtualizados)}`);

        } catch (erro) {
            tratarErro('Erro ao atualizar usuário', erro, next);
        }
    }

    static async excluirUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await UsuarioService.excluirUsuario(req.params.id);

            if (resultado && 'erro' in resultado) {
                return responderAPI(res, HTTPStatus.BAD_REQUEST, resultado, "Erro ao excluir usuário");
            }

            responderAPI(res, HTTPStatus.OK, resultado ?? undefined, "Usuário excluído com sucesso");
            await registrarLog(TiposDeLog.INFO, `Usuário excluído: ${resultado.id}`);

        } catch (erro) {
            tratarErro('Erro ao excluir usuário', erro, next);
        }
    }
}

export default UsuarioController;