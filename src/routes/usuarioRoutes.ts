import { Router, Request, Response, NextFunction } from 'express';
import UsuarioController from '../controllers/usuarioController';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.cadastrarUsuario(req, res, next);
});

router.get('/nome/:nome', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.obterUsuariosPorNome(req, res, next);
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

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    UsuarioController.listarUsuarios(req, res, next);
});

export default router;
