import { SNACKS_ERRORS, FILE_ERRORS } from "../utils/errorMessages";
import { FileType, JOB_NAME, STATUS } from "../utils/const";
import Snacks from "../models/snacks.model";
import Files from "../models/files.model";
import { pagination } from "../utils/common";
import Sequelize from "sequelize";
import SnackProducts from "../models/snacksProducts.model";
const { Op } = Sequelize;
import RABBIT from "../libs/rabbitmq/init";

/**
 * [ADMIN] get taste from system
 * @param  {Object} 
 * @returns {Promise}
 */
export const getSnacks = async (query: any) => {
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const order = query?.order === 'DESC' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];

    const cond: any = Object.assign({},
        {
            where: { status: STATUS.ACTIVE },
            offset: offset > 0 ? (offset - 1) * limit : offset,
            limit: +limit,
            order: order as any,
            include: ['imageUrl']
        });

    const { count, rows } = await Snacks.findAndCountAll(cond);
    const snacks = rows.map(snack => snack.toSnackAdminList())
    if (!offset) {
        return Promise.resolve(snacks);
    }
    const metaData = await pagination(count, +offset, +limit, rows.length);
    return Promise.resolve({ snacks, metaData });
};

/**
 * [ADMIN] delete taste from system
 * @param  {Object}
 * @returns {Promise}
 */
export const deleteSnack = async (query: any) => {
    const { id } = query;
    const check = await await Snacks.findOne({ where: { id, status: STATUS.ACTIVE } });
    if (!check) {
        return Promise.reject(SNACKS_ERRORS.SNACKS_NOT_FOUND());
    }
    await Promise.all([
        Files.update({ status: STATUS.DELETED }, { where: { id: check.image, type: FileType.ICONS, status: STATUS.ACTIVE } }),
        Snacks.update({ status: STATUS.DELETED }, { where: { id, status: STATUS.ACTIVE } }),
        SnackProducts.destroy({ where: { snackId: id } })
    ]);
    return Promise.resolve({ message: "Delete successfully" });
};


/**
 * [ADMIN] delete taste from system
 * @param  {Object}
 * @returns {Promise}
 */
export const deleteSnacks = async (body: any) => {
    const { snackIds } = body;
    await Snacks.update({ status: STATUS.DELETED }, { where: { id: { [Op.in]: snackIds }, status: STATUS.ACTIVE } });
    await Promise.all([
        SnackProducts.destroy({ where: { snackId: { [Op.in]: snackIds } } }),
        RABBIT.sendDataToRabbit(JOB_NAME.DELETE_SNACKS, { snackIds })
    ]);
    return Promise.resolve({ message: "Delete successfully" });
};


/**
 * [ADMIN] create taste from system
 * @param  {Object} 
 * @returns {Promise}
 */
export const createSnack = async (body: any) => {
    const { image, name } = body;
    const checkFile = await Files.findOne({ where: { id: image, type: FileType.ICONS, status: STATUS.ACTIVE } });
    if (!checkFile) {
        return Promise.reject(FILE_ERRORS.FILE_NOT_FOUND());
    }
    const snack = await Snacks.create({ image, name })
    return Promise.resolve(snack);
};

/**
 * [ADMIN] update taste from system
 * @param  {Object} 
 * @returns {Promise}
 */
export const updateSnack = async (body: any) => {
    const { snackId, image, name } = body;
    const checkFile = await Files.findOne({ where: { id: image, type: FileType.ICONS, status: STATUS.ACTIVE } });
    if (!checkFile) {
        return Promise.reject(FILE_ERRORS.FILE_NOT_FOUND());
    }
    const checkSnack = await Snacks.findOne({ where: { id: snackId, status: STATUS.ACTIVE } });
    if (!checkSnack) {
        return Promise.reject(SNACKS_ERRORS.SNACKS_NOT_FOUND());
    }
    await Snacks.update({ image, name }, { where: { id: snackId, status: STATUS.ACTIVE } });
    return Promise.resolve({ message: "Update successfully" });
};

/**
 * [ADMIN] get taste from system
 * @param  {Object}
 * @returns {Promise}
 */
export const getSnack = async (query: any) => {
    const { id } = query;
    const result = await Snacks.findOne({ where: { id, status: STATUS.ACTIVE }, include: ['imageUrl'] });
    if (!result) {
        return Promise.reject(SNACKS_ERRORS.SNACKS_NOT_FOUND());
    }
    return Promise.resolve(result.toSnackAdminList());
};