import Express, { Application } from 'express';
import Http, { Server } from 'http';
import Middleware from './middleware';
import WrapperRouter from '../routers';
import { CONFIG } from '../utils/const';

(async () => {
    try {
        await import('../libs/rabbitmq');
        await import('../libs/mysql');
        
        // Init app instance
        const app: Application = Express();

        // Config middleware modules
        Middleware(app);

        const server: Server = Http.createServer(app);

        // wrapper router
        WrapperRouter(app);

        /**
         * Start listening app on port
         */
        server.listen(CONFIG.SERVER_PORT, () => {
            console.log(`Listening on port ${CONFIG.SERVER_PORT}\n======================`)
        });
    }
    catch (err) {
        console.warn(err);
    }
})();