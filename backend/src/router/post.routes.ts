import { Router } from "express-serve-static-core";
import AuthController from '../controller/auth';

export default class PostRoutes {
    constructor(router: Router) {
        
        router.post('/auth/register', AuthController.register)
        router.post('/auth/login', AuthController.login);

    }  
} 
