import express, {Router} from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import GetRoutes from './get.routes'
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

    private static attachMiddlewares(app): void {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());


        app.set('view engine', 'hbs');
        app.set('views', path.join(__dirname, '../../../frontend/views'));
        app.use(express.static(path.join(__dirname, '../../../frontend/public')));


        app.use((req, res, next): void => {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header(
              'Access-Control-Allow-Headers',
              'Origin, X-Requested-With, Content-Type,  Accept, Authorization'
            );
            res.header('Access-Control-Allow-Methods', 'GET,POST,fetch, PATCH,OPTIONS,DELETE');
            res.header('Access-Control-Allow-Credentials', true);
      
            if (req.method === 'OPTIONS') {
              res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH,FETCH, DELETE, GET');
              return res.json({});
            } else {
              next();
            }
          });

          // app.use(express.static(path.join('../frontend/build')));
          // app.get('/', async (req, res) => {
          //   try {
          //     res.sendFile(path.resolve('../frontend/build/index.html'));
          //   } catch (error) {
          //     console.log('files route error: ', error);
          //     res.end();
          //   }
          // });

    }
}