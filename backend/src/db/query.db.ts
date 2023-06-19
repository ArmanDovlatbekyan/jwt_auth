import { Pool } from 'mysql2/promise';

import { IUser } from '../interface/interfaces';


export async function createUser(user: IUser): Promise<IUser> {
    try {
        const sql = 'INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
        const values = [user.name, user.email, user.password, user.created_at, user.updated_at];

        const [result] = await global['Mysql.DB'].query(sql, values);
        const insertedId = result.insertId;

        return { ...user, id: insertedId };

    } catch (e)  {
        console.log(e);
        console.error('createUser Error::', e);
    } 

}


export async function getUserByEmail(email: string): Promise<IUser> {
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const values = [email];
  
      const [rows] = await global['Mysql.DB'].query(sql, values);
  
      if (rows.length === 0) return null;
      
  
      const user: IUser = rows[0] as IUser;
      return user;

    } catch (e) {
      console.error('getUserByEmail::', e);
      throw e;
    }
}

export async function getUserById(id: number): Promise<IUser> {
    try {
      const sql = 'SELECT * FROM users WHERE id = ?';
      const values = [id];
  
      const [rows] = await global['Mysql.DB'].query(sql, values);
  
      if (rows.length === 0) return null;
      
  
      const user: IUser = rows[0] as IUser;
      return user;

    } catch (e) {
      console.error('getUserByEmail::', e);
      throw e;
    }
}


export async function checkEmail(email: string): Promise<number> {
        try {
        const sql = 'SELECT email FROM users WHERE email = ?';
        const values = [email];

        const [rows] = await global['Mysql.DB'].query(sql, values);

        if (rows.length === 0) {
            return 0;
        } else {
            return rows[0];
        }
        
    } catch (e) {
      console.error('getUserByEmail::', e);
      throw e;
    }
}
