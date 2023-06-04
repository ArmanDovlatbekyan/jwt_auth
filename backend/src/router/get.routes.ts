import { Router, Request, Response, NextFunction } from "express";
import { authenticateUser } from "../models /middlewares";
// import { byTokenRequest } from ".. /interface/interfaces"
import AuthController from '../controller/auth'


export default class GetRoutes {
  constructor(router: Router) {

    

    router.get('/', authenticateUser, (req: Request, res: Response) => {
      res.redirect('/login');
    });
    
    router.get('/register', (req: Request, res: Response) => {
      const { token } = req.cookies;
      if (token) {
        res.redirect('/login')
      } else {res.render('register')}
    });

    router.get('/login', authenticateUser, (req: Request, res: Response) => {
      const { userInfo } = req.body;
      if (userInfo) {    
        const { username } = userInfo;
        res.render('index', { username })
      } else {res.render('login')}
    });

    router.get('/index', authenticateUser, (req: Request, res: Response) => {
      res.render('index');
    });

    router.get('/logout', authenticateUser, AuthController.logout);

  }


}
