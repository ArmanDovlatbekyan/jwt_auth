import { Router, Request, Response, NextFunction } from "express";
import { authenticateUser } from "../models /middlewares";
// import { byTokenRequest } from ".. /interface/interfaces"
import AuthController from "../controller/auth"
import { userInfo } from "os";

export default class GetRoutes {
  constructor(router: Router) {

    
    router.get('/', authenticateUser, (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Token has been verified correctly',
        userInfo: req.body.userInfo['username']
      });
    });

    router.get('/user', authenticateUser, (req: Request, res: Response) => {
      const { username } = req.body.userInfo
      res.status(200).json({
        success: true,
        message: 'user info',
        username
      });
    });
    
  }


}
