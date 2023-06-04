
import jwt from 'jsonwebtoken';
import { getUserById } from '../db/query.db'
import { Request, Response , NextFunction } from 'express';


export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { token } = req.cookies;
  try {
    if (!token) {
      res.status(401).render('login');
      // console.log('empty token');
      return;
    }
  
    const user = jwt.verify(token, 'terset');

    if (!user) {
      res.status(403).render('login',{
        error: 'Invalid token, please login again'
      });
      return;
    }

    const userInfo = await getUserById(user['userId']);
    req.body.userInfo = userInfo;

    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


  