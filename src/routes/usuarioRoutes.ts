import express from 'express';
import UsuarioController from '../controllers/usuarioController';
import { validarCorpoDaRequisicao } from '../utils/commons';
import { usuarioSchema, usuarioUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/cadastro', validarCorpoDaRequisicao(usuarioSchema), UsuarioController.cadastrarUsuario);
router.get('/', UsuarioController.listarUsuarios);
router.get('/:id', UsuarioController.obterUsuarioPorId);
router.get('/nome/:nome', UsuarioController.obterUsuariosPorNome);
router.put('/:id', validarCorpoDaRequisicao(usuarioUpdateSchema), UsuarioController.atualizarUsuario);
router.delete('/:id', UsuarioController.excluirUsuario);

export default router;
