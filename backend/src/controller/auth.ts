import express, { Request, Response } from 'express';
import {config} from 'dotenv';
config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';


import { IUser } from '../interface/interfaces';

import { createUser, checkEmail, getUserByEmail } from '../db/query.db';
import { setTokenInRedis, getTokenFromRedis, deleteTokenFromRedis } from '../db/redis.db';




export default new class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // console.log('req body ->', req.body);
      const { name,  email, password, passwordConfirm } = req.body;

      if (!name || !email || !password || !passwordConfirm) {
        console.log(1);
        res.status(302).render('register', {
          message: "Please fill all fields"
        });
        return;
      }

      if (password !== passwordConfirm) {
        res.render('register', {
          error: 'Passwords do not match'
         });
        return;
      }

      const emailExists = await checkEmail(name, email);
      if (emailExists) {
        if (password !== passwordConfirm) {
          res.render('register', {
            error: 'Email already exists'
           });
          return;
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 8);
      // console.log('hashedPassword ->', hashedPassword);
  
      const user: IUser = {
        name,
        email,
        password: hashedPassword,
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      };
  
      const newUser = await createUser(user);

      if (newUser) {
        const token = jwt.sign({ userId: newUser.id }, 'terset');
        console.log('token ->', token);
        console.log('newUser ->', newUser);
      
        try {
          const check = await setTokenInRedis(token, newUser.id);
          if (check) {
            console.log('check ->', check);
      
            res.cookie('token', token, { maxAge: 259200000 }); // 3 days
            res.redirect(302, `/index`);
            return;
          }
        } catch (error) {
          console.error('Error setting token in Redis:', error);
        }
      }
      
      
    } catch (error) {       
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
  


  async login(req: Request, res: Response): Promise<void> {
    try {
      // console.log('login req body ->', req.body)
      const { email, password } = req.body;

      if (!email || !password) {
        console.log(1);
        res.status(302).render('login', {
          message: "Please fill in both fields"
        });
        return;
      }
 
      const userInfo = await getUserByEmail(email);
      if (!userInfo) {
        console.log(1);
        res.status(302).render('register', {
          message: "User does't exist"
        });
        return;
      }

      if(!(await bcrypt.compare(password, userInfo.password))) {
        console.log(2);
        res.status(302).render('login', {
          message: "password is not correct"
        });
        return;
      }
        

      const token = jwt.sign({ userId: userInfo.id }, 'terset');
      const check = await setTokenInRedis(token, userInfo.id);
      if (check) {
        console.log(3);
        console.log('login check ->', check);
        console.log('userInfo ->', userInfo); 

        res.cookie('token', token, { maxAge: 259200000 }); // 3 days
        res.render('index', {
          message : userInfo['username']
        });
        return;
      }
      
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    
    try {

      const { token } = req.cookies;
      // console.log('logout token ->', token);
      
      const user = jwt.verify(token, 'terset');
      // console.log('user in token ->', user);
      const userId = user['userId'];
  
      const existToken = await getTokenFromRedis(userId);
      // console.log('existToken ->', existToken);
  
      if (existToken) {
        await deleteTokenFromRedis(userId);
      }
  
      res.clearCookie('token');
      res.redirect('/login');
    } catch (e) {
      console.error('Error during logout:', e);
    }

  }
 }


