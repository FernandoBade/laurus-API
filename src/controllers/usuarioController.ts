import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { responderAPI } from '../utils/commons';

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioExistente = await UsuarioService.obterUsuarioPorEmail(req.body.email);
            if (usuarioExistente) return responderAPI(res, 400, 'erro_emailJaCadastrado');

            const novoUsuario = await UsuarioService.criarUsuario(req.body);
            responderAPI(res, 201, 'sucesso_cadastrar', novoUsuario);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarUsuarios(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.listarUsuarios();
            responderAPI(res, 200, 'sucesso_buscar', usuarios);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterUsuarioPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await UsuarioService.obterUsuarioPorId(req.params.id);
            if (!usuario) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_buscar', usuario);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterUsuariosPorNome(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.obterUsuariosPorNome(req.params.nome);
            if (!usuarios.length) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_buscar', usuarios);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioAtualizado = await UsuarioService.atualizarUsuario(req.params.id, req.body);
            if (!usuarioAtualizado) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_atualizar', usuarioAtualizado);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            await UsuarioService.excluirUsuario(req.params.id);
            responderAPI(res, 200, 'sucesso_excluir', { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default UsuarioController;
