import mysql from 'mysql2/promise'

interface IConfig {
    USERNAME: string | undefined;
    PASSWORD: string | undefined;
    HOST: string | undefined;
    PORT: string | undefined;
    DB_NAME: string | undefined;
}
/**
 * @class MysqlDb 
 * @description
 * Mysql connection 
 */
class MysqlDb implements IConfig {
    USERNAME: string;
    PASSWORD: string;
    HOST: string;
    PORT: string;
    DB_NAME: string;
    public db: mysql.Pool;

    private get config(): IConfig {
        return {
            USERNAME: process.env.MYSQL_USERNAME,
            PASSWORD: process.env.MYSQL_PASSWORD,
            HOST: process.env.MYSQL_HOSTNAME,
            PORT: process.env.MYSQL_PORT,
            DB_NAME: process.env.MYSQL_DB,
        };
    }

    public async connect(): Promise<void> {
        try {
            const {
                USERNAME,
                PASSWORD,
                HOST,
                PORT,
                DB_NAME
            } = this.config;
    
            this.db = await mysql.createPool({
                user: USERNAME,
                password: PASSWORD,
                host: HOST,
                database: DB_NAME,
                port: Number(PORT)
                
            })

            await this.authenticate()
            global['Mysql.DB'] = this.db;
        } catch(e) {
            return Promise.reject(e);
        }
    }

    private async authenticate(): Promise<void> {
        return this.db.query('select 1')
            .then(() => {
                console.log('MYSQL Connected::', this.config.DB_NAME);
            })
            .catch((err) => {
                console.error('Unable to connect to the database', err);
                throw new Error('Unable to connect to the database');
            });
    }
}

export default new MysqlDb();
