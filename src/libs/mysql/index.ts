
import dns from "dns";
const dnscache = require("dnscache");
import { Sequelize } from "sequelize";
import { DATABASE_CONFIG } from "../../utils/const";

const dnscacheConfig = new dnscache({
    "enable": true,
    "ttl": 1,
    "cachesize": 1000
})

const DB = new Sequelize(
    DATABASE_CONFIG.DB,
    DATABASE_CONFIG.USER,
    DATABASE_CONFIG.PASSWORD,
    {
        dialect: DATABASE_CONFIG.DIALECT,
        port: DATABASE_CONFIG.PORT,
        host: DATABASE_CONFIG.HOST,
        pool: DATABASE_CONFIG.pool,
        logging: false,
        define: DATABASE_CONFIG.define,
    }
);

(async () => {
    try {
        dns.lookup(DATABASE_CONFIG.HOST, (err: any, result: any) => {
            console.log("[DNS] ---------->", result);
        })
        dnscacheConfig.lookup(DATABASE_CONFIG.HOST, (err: any, result: any) => {
            console.log("[DNSCACHE] ---------->", result);
        })
        await DB.authenticate();
        console.log(`[Database] Connection successful ${DATABASE_CONFIG.HOST}:${DATABASE_CONFIG.PORT}`);
    } catch (error) {
        console.error(`[Database] Connection failed `, error);
    }
})();

export { DB }