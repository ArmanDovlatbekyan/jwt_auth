import jwt from 'jsonwebtoken';
import { getUserById } from '../db/query.db';
import { Request, Response, NextFunction } from 'express';

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {

  let { token } = req.headers
  token = token?.toString().split(' ')[1];
  try {

    if (!token) {
      res.status(403).json({ error: 'Authentication failed: Token not provided' });
      return;
    }

    const user = jwt.verify((token), 'terset');

    if (!user) {
      res.status(403).json({ error: 'Authentication failed: Invalid token' });
      return;
    }

    const userInfo = await getUserById(user['userId']);
    req.body.userInfo = userInfo;

    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
