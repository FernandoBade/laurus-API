import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { StatusHttp } from '../utils/enum';

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            if (await UsuarioService.obterUsuarioPorEmail(req.body.email)) {
                return res.status(StatusHttp.REQUISICAO_INVALIDA).json({ sucesso: false, mensagem: "E-mail já cadastrado" });
            }

            const novoUsuario = await UsuarioService.criarUsuario(req.body);
            res.status(StatusHttp.CRIADO).json({ sucesso: true, dados: novoUsuario });
        } catch (erro) {
            next(erro);
        }
    }

    static async listarUsuarios(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.listarUsuarios();
            res.status(StatusHttp.SUCESSO).json({ sucesso: true, dados: usuarios });
        } catch (erro) {
            next(erro);
        }
    }

    static async obterUsuarioPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await UsuarioService.obterUsuarioPorId(req.params.id);
            if (!usuario) {
                return res.status(StatusHttp.NAO_ENCONTRADO).json({ sucesso: false, mensagem: "Usuário não encontrado" });
            }

            res.status(StatusHttp.SUCESSO).json({ sucesso: true, dados: usuario });
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioAtualizado = await UsuarioService.atualizarUsuario(req.params.id, req.body);
            if (!usuarioAtualizado) {
                return res.status(StatusHttp.NAO_ENCONTRADO).json({ sucesso: false, mensagem: "Usuário não encontrado" });
            }

            res.status(StatusHttp.SUCESSO).json({ sucesso: true, dados: usuarioAtualizado });
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            await UsuarioService.excluirUsuario(req.params.id);
            res.status(StatusHttp.SUCESSO).json({ sucesso: true, mensagem: "Usuário excluído com sucesso" });
        } catch (erro) {
            next(erro);
        }
    }
}

export default UsuarioController;
