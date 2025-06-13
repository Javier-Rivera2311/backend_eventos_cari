import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getUsuarios,
  changePassword,
  login,
  updateUser,
  getContacts,
  updateContact,
  addContact,
  deleteContact,
  getDepartamentosUsuarios
} from '../controllers/user.js';

const router = Router();

router.route('/mostrar')
  .get(getUsuarios);

router.route('/login')
  .post(login);

router.route('/changePassword')
  .post(changePassword);

router.route('/updateUser')
  .post(updateUser);

router.route('/Contacts')
  .get(getContacts);

router.route('/updateContact/:id')
  .put(updateContact);

router.route('/addContact')
  .post(addContact);

router.route('/deleteContact/:id')
  .delete(deleteContact);

router.route('/departamentosUsuarios')
  .get(getDepartamentosUsuarios);

export default router;
