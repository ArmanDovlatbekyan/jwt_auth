import { Router } from "express-serve-static-core";
import AuthController from '../controller/auth';
import { Request, Response , NextFunction } from "express";

export default class PostRoutes {
    constructor(router: Router) {

        router.post('/auth/register', AuthController.register)
        router.post('/auth/login', AuthController.login);


        router.all('*', (req: Request, res: Response, next: NextFunction) => {
            if(req.cookies.token) {
                res.redirect('/login');
                return;
            }
            res.render('error', { error: 'path not found' });
          });
    }  
} 
