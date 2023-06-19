import express, { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import GetRoutes from './get.routes';
import PostRoutes from './post.routes';

const expressRouter = Router();

export default class InitRouter {
  constructor(app: express.Application) {
    InitRouter.attachMiddlewares(app);
    InitRouter.init();
    app.use(expressRouter);
  }

  private static init(): void {
    new GetRoutes(expressRouter);
    new PostRoutes(expressRouter);
  }

  private static attachMiddlewares(app: express.Application): void {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    
    app.use(
      cors({
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
        credentials: true, 
      })
    );

    app.use((req: Request, res: Response, next: NextFunction): void | Response<Record<string, any>> => {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, FETCH, DELETE, GET');
        return res.status(200).json({});
      } else {
        next();
      }
    });
  }
}
