import { Router } from "express";
import * as userController from "../controllers/user.controller";
import {authenticate } from "../middlewares/auth.middleware";

const UserRoutes = Router({mergeParams:true})

UserRoutes.post('/', userController.createUser);
UserRoutes.get('/', userController.getUsers);
UserRoutes.get('/:id', userController.getUsersById);
UserRoutes.post('/login', userController.loginUser);
UserRoutes.delete('/:id',authenticate, userController.deleteUser);
UserRoutes.put('/:id', authenticate, userController.updateUser);

export default UserRoutes