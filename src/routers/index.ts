import { Application, Request, Response, NextFunction } from 'express';
import clientRouters from './client';
import adminRouters from './admin';
import { logger } from "../libs/logs";
import swaggerUi from 'swagger-ui-express'
import * as swaggerAdminDocument from '../public/adminSwagger.json'
import * as swaggerAppDocument from '../public/appSwagger.json'

export default (app: Application) => {

    const headerMiddleWare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.set({
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            });
            next();
        }
        catch (err) {
            logger.error(err);
        }
    };

    app.use('/admin-api-docs', swaggerUi.serveFiles(swaggerAdminDocument, {}), swaggerUi.setup(swaggerAdminDocument));
    app.use('/app-api-docs', swaggerUi.serveFiles(swaggerAppDocument, {}), swaggerUi.setup(swaggerAppDocument));

    app.use('/api/CLIENT/v1', headerMiddleWare, clientRouters);
    app.use('/api/ADMIN/v1', headerMiddleWare, adminRouters);

    app.use('/welcome', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(`
            <html lang="en">
        <style>
            *, 
            *:before, 
            *:after {
                box-sizing: inherit;
                margin: 0;
                padding: 0;
            }
            html {
                box-sizing: border-box;
                background: #EEEEEE;
                text-align: center;
            }
            body {
                font-size: 1em;
                line-height: 1.5;
                font-family: Lucida Grande, sans-serif;
                max-width: 43.75em; /* 880/16 */
                margin: 0 auto;
                padding: 0;
            }
        </style>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <header>
            <h1>>WELCOME TO LOCAL LIQUOR API</h1>
        </header>
        </head>
    </html>
            `);
            return;
        }
        catch (err) {
            logger.error(err);
        }
    })
};