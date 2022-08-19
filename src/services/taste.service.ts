import { logger } from "../libs/logs";
import { STATUS } from "../utils/const";
import Tastes from "../models/tastes.model";

/**
 * [ADMIN] get taste from system
 * @param  {Object} 
 * @returns {Promise}
 */
export const getTastes = async () => {
    const result = await Tastes.findAll({ where: { status: STATUS.ACTIVE } });
    return Promise.resolve(result);
}
