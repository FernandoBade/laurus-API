import { Router, Request, Response, NextFunction } from 'express';
import UsuarioController from '../controllers/usuarioController';
import { tratarErro, responderAPI } from '../utils/commons';
import { HTTPStatus } from '../utils/enums';


const router = Router();

router.get('/buscar', async (req: Request, res: Response, next: NextFunction) => {
    const emailTermo = req.query.email as string;
    try {
        const usuarios = await UsuarioController.obterUsuariosPorEmail(emailTermo, req, res, next);
        responderAPI(res, HTTPStatus.OK, usuarios);
    } catch (erro) {
        await tratarErro('Erro ao buscar usuários', erro, next);
    }
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.cadastrarUsuario(req, res, next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.listarUsuarios(req, res, next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.obterUsuarioPorId(req, res, next);
});


router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.atualizarUsuario(req, res, next);
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.excluirUsuario(req, res, next);
});

export default router;
