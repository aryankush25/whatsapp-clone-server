import express, { Request, Response, NextFunction } from 'express';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { Routes } from './routes';
import authMiddleware from './middlewares/auth';

// create typeorm connection
console.info('Connecting to DB');
createConnection()
  .then(() => {
    // create and setup express app
    const app = express();
    app.use(express.json());

    // register routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        route.openAuth
          ? (req: Request, res: Response, next: NextFunction) => {
              next();
            }
          : authMiddleware,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](req, res, next);

          if (result instanceof Promise) {
            result.then((result) => (result !== null && result !== undefined ? res.send(result) : undefined));
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        },
      );
    });

    const port = process.env.PORT || 7000;

    // start express server
    app.listen(port, () => {
      console.log('Server is up at -> ' + `http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
