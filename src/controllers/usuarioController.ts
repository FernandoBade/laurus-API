import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { logger, tratarErro } from '../utils/commons';

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                email,
                nome,
                sobrenome,
                senha,
                dataNascimento: dataCadastro } = req.body;

            if (!email || !nome || !sobrenome || !senha || !dataCadastro) {
                return res.status(400).json({ sucesso: false, mensagem: "Todos os campos são obrigatórios" });
            }

            const novoUsuario = await UsuarioService.criarUsuario(req.body);
            res.status(201).json({ sucesso: true, dados: novoUsuario });
            logger.info(`Usuário ${nome} ${sobrenome} cadastrado com sucesso`);
        } catch (erro) {
            tratarErro(erro, 'Erro ao cadastrar usuário', next);
        }
    }

    static async listarUsuarios(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.listarUsuarios();
            res.status(200).json({ sucesso: true, dados: usuarios });
        } catch (erro) {
            tratarErro(erro, 'Erro ao listar usuários', next);
        }
    }

    static async obterUsuarioPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioService.obterUsuarioPorId(id);
            if (!usuario) {
                return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
            }
            res.status(200).json({ sucesso: true, dados: usuario });
        } catch (erro) {
            tratarErro(erro, 'Erro ao obter usuário por ID', next);
        }
    }

    static async atualizarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;
            const usuarioAtualizado = await UsuarioService.atualizarUsuario(id, dadosAtualizados);
            if (!usuarioAtualizado) {
                return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
            }
            res.status(200).json({ sucesso: true, dados: usuarioAtualizado });
            logger.info(`
                Usuário ${usuarioAtualizado.nome} ${usuarioAtualizado.sobrenome} atualizado com sucesso.
                Dados atualizados: ${JSON.stringify(dadosAtualizados)}`);
        } catch (erro) {
            tratarErro(erro, 'Erro ao atualizar usuário', next);
        }
    }

    static async excluirUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            await UsuarioService.excluirUsuario(req.params.id);
            res.status(200).json({ sucesso: true, mensagem: "Usuário excluído com sucesso" });
        } catch (erro) {
            tratarErro(erro, 'Erro ao excluir usuário', next);
        }
    }

    static async obterUsuariosPorNome(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome } = req.params;
            const usuarios = await UsuarioService.obterUsuariosPorNome(nome);
            res.status(200).json({ sucesso: true, dados: usuarios });
        } catch (erro) {
            tratarErro(erro, 'Erro ao obter usuários por nome', next);
        }
    }
}

export default UsuarioController;
