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
      const { name,  email, password, passwordConfirm } = req.body;

      if (!name || !email || !password || !passwordConfirm) {
        res.status(400).json({ success: false, error: 'Please fill all fields'});
        return;
      }

      if (password !== passwordConfirm) {
        res.status(400).json({ success: false, error: 'Passwords do not match' });
        return;
      }

      const emailExists = await checkEmail(email);

      if (emailExists) {  
        res.status(400).json({ success: false, error: 'Email already exists' });
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 8);
  
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
      
        try {
          const check = await setTokenInRedis(token, newUser.id);
          if (check) {
            
            res.cookie('token', token, { maxAge: 259200000 }); // 3 days
            res.json({ success: true, message: 'Registration completed successfully' });
            return;
          }
        } catch (error) {
          console.error('Error setting token in Redis:', error);
        }
      }
      
      res.status(500).json({ success: false, message: 'Registration failed' });
    } catch (error) {       
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
  

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({success: false, message: "Please fill in both fields"});
        return;
      }
 
      const userInfo = await getUserByEmail(email);
      if (!userInfo) {
        res.status(400).json({ success: false, message: "User doesn't exist"});
        return;
      }

      if(!(await bcrypt.compare(password, userInfo.password))) {
        res.status(400).json({ success: false, message: 'Incorrect password'})
        return;
      }

      const token = jwt.sign({ userId: userInfo.id }, 'terset');
      const check = await setTokenInRedis(token, userInfo.id);
      

      if (check) {
        res.cookie('token', token, { maxAge: 259200000 }); // 3 days
        res.json({ success: true, userName: userInfo['username'], token });
        return;
      }
      
      res.status(500).json({ success: false, message: 'Login failed'});
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    
    try {

      const { token } = req.cookies;
      
      const user = jwt.verify(token, 'terset');
      const userId = user['userId'];
  
      const existToken = await getTokenFromRedis(userId);
  
      if (existToken) {
        await deleteTokenFromRedis(userId);
      }
  
      res.clearCookie('token');
      res.json({ success: true, message: 'Logout successful' });

    } catch (e) {
      console.error('Error during logout:', e);
      res.json(500).json({ success: false, message: 'Logout failed' });
    }
  }


  async getInfo(req: Request, res: Response): Promise<void> {
    
  }
 }


