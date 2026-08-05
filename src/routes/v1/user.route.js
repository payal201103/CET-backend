import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as userValidation from '../../validations/user.validation.js';
import UserController from '../../controllers/user.controller.js';

const router = express.Router();
const userController = new UserController();

router.use(validateToken);

router.get('/', userController.getAllUsers);
router.post('/', validateSchema(userValidation.createUser), userController.createUser);
router.delete('/:id', userController.deleteUser);

export default router;
