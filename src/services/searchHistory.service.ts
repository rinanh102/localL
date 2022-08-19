import RABBIT from "../libs/rabbitmq/init";
import { JOB_NAME, STATUS } from "../utils/const";
import SeachHistories from "../models/searchHistories.model";
import { SEACH_HISTORY_ERRORS, USER_ERRORS } from "../utils/errorMessages";
import Keywords from "../models/keywords.model";
import Users from "../models/users.model";

/**
 * [APP] get recent search histories
 * @param  {Object} 
 * @returns {Promise}
 */
export const getRecentSearchHistories = async (req: any) => {
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const recentSearch = await SeachHistories.findAll({
        where: {userId, status: STATUS.ACTIVE },
        include: [
            {
                model: Keywords,
                as: 'keyword',
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10

    })
    const result = recentSearch.map(data => data.toDataSearchHistory());
    return Promise.resolve(result);
}
/**
 * [APP] delete search historie
 * @param  {Object} 
 * @returns {Promise}
 */
export const deleteSearchHistory = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const { id } = query;
    if (id != 0) {
        const member = await SeachHistories.findOne({ where: { id, userId, status: STATUS.ACTIVE } });
        if (!member) {
            return Promise.reject(SEACH_HISTORY_ERRORS.SEARCH_HISTORY_NOT_FOUND());
        }
        await SeachHistories.destroy({ where: { id, status: STATUS.ACTIVE } });
        return Promise.resolve({ mesages: "Delete one successfully!" });
    } else {
        await SeachHistories.destroy({ where: { userId, status: STATUS.ACTIVE } });
        return Promise.resolve({ mesages: "Delete all successfully!" });
    }
}