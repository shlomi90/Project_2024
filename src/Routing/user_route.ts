import express from 'express';
const router = express.Router()
import User from  '../Controllers/user_controller';

router.get('/', User.getAllUsers);

router.get('/:id', User.getUserById);

router.post('/', User.postUser);

router.put('/:id', User.putUser);

router.delete('/:id', User.deleteUser);

export default router;
