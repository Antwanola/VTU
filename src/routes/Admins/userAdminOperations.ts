import express from 'express';
import { authController } from '../../controllers/authController';
import { newUserRoleController } from '../../controllers/AdminController/userRole';


const userAdminRoute = express.Router();
userAdminRoute.post('/update-user', authController.authenticationToken, authController.isAdmin,  newUserRoleController.changeUserRole);
export default userAdminRoute;

