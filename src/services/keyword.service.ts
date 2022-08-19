import Keywords from "../models/keywords.model";
import { KeywordType, STATUS } from "../utils/const";
import { KEYWORD_ERRORS } from "../utils/errorMessages";
import Sequelize from "sequelize";

const { literal } = Sequelize;
/**
 * [APP] get popular keywords
 * @param  {Object} 
 * @returns {Promise}
 */

export const getPopularKeywords = async () => {
    const keywordsSearch = await Keywords.findAll({
        where: {
            type: KeywordType.SEARCH,
            status: STATUS.ACTIVE,
        },
        order: [['totalSearch', 'DESC']],
        limit: 4
    })
    const keywordsAdmin = await Keywords.findAll({
        where: {
            type: KeywordType.ADMIN,
            status: STATUS.ACTIVE,
        },
        order: [['totalSearch', 'DESC']],
        limit: 2
    })
    const resultAdmin = keywordsAdmin.map(data => data.toDataKeyword());
    const resultSearch = keywordsSearch.map(data => data.toDataKeyword());
    return Promise.resolve({
        search: resultSearch,
        admin: resultAdmin
    });
}

/**
 * [ADMIN] update keywords
 * @param  {Object} 
 * @returns {Promise}
 */

export const updateKeyword = async (body: any) => {
    const { keywordId, hightlight } = body;
    const key = await Keywords.findOne({ where: { id: keywordId, status: STATUS.ACTIVE } });
    if (!key) {
        return Promise.reject(KEYWORD_ERRORS.KEYWORD_NOT_FOUND());
    }
    return Promise.resolve({ mesages: "Update successfully!" });
}

/**
 * [ADMIN] create keywords
 * @param  {Object} 
 * @returns {Promise}
 */

export const createKeyword = async (body: any) => {
    const { keyword } = body;
    const check = await Keywords.findOne({ where: { content: keyword, type: KeywordType.ADMIN, status: STATUS.ACTIVE } });
    if (!check) {
        const key = await Keywords.create({ content: keyword, type: KeywordType.ADMIN });
        return Promise.resolve(key.toJSON());
    }
    await check.update({ totalSearch: literal('totalSearch+1') });
    return Promise.resolve(check.toJSON());
}

/**
 * [ADMIN] delete keywords
 * @param  {Object}
 * @returns {Promise}
 */

export const deleteKeyword = async (query: any) => {
    const { id } = query;
    const key = await Keywords.findOne({ where: { id, status: STATUS.ACTIVE } });
    if (!key) {
        return Promise.reject(KEYWORD_ERRORS.KEYWORD_NOT_FOUND());
    }
    await key.update({ totalSearch: key.totalSearch > 0 ? literal('totalSearch-1') : 0 });
    return Promise.resolve({ mesages: "Delete successfully!" });
}