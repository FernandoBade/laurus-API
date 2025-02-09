import { Router, Request, Response, NextFunction } from 'express';
import UsuarioController from '../controllers/usuarioController';
import { tratarErro } from '../utils/commons';

const router = Router();

router.get('/buscar', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UsuarioController.obterUsuariosPorEmail(req.query.email as string, req, res, next);
    } catch (erro) {
        await tratarErro('Erro ao buscar usuários', erro, next);
    }
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        UsuarioController.cadastrarUsuario(req, res, next);
    } catch (erro) {
        tratarErro('Erro ao cadastrar usuário', erro, next);
    }
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        UsuarioController.listarUsuarios(req, res, next);
    } catch (erro) {
        tratarErro('Erro ao listar usuários', erro, next);
    }
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        UsuarioController.obterUsuarioPorId(req, res, next);
    } catch (erro) {
        tratarErro('Erro ao obter usuário por ID', erro, next);
    }
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        UsuarioController.atualizarUsuario(req, res, next);
    } catch (erro) {
        tratarErro('Erro ao atualizar usuário', erro, next);
    }
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        UsuarioController.excluirUsuario(req, res, next);
    } catch (erro) {
        tratarErro('Erro ao excluir usuário', erro, next);
    }
});

export default router;
