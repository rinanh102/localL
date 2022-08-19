import Bundles from "../models/bundles.model";
import RABBIT from "../libs/rabbitmq/init";
import { JOB_NAME, STATUS } from "../utils/const";
import { GIFT_ERRORS } from "../utils/errorMessages";
import ProductsBundles from "../models/productsBundles.model";
import { pagination } from "../utils/common";
import Products from "../models/products.model";
import Sequelize from "sequelize";
import Files from "../models/files.model";

const { Op, literal } = Sequelize;

/**
 * [APP] GET  total click gift
 * @param req
 * @param res
 * @returns
 */
export const updateTotalClick = async (query: any) => {
    const { id } = query;
    const gift = await Bundles.findOne({ where: { id, status: STATUS.ACTIVE } })
    if (!gift) {
        return Promise.reject(GIFT_ERRORS.GIFT_NOT_FOUND());
    }
    await Bundles.update({ totalClick: literal('totalClick+1') }, { where: { id, status: STATUS.ACTIVE } })
    return Promise.resolve({ message: "Update total click Successfully" });
}

/**
 * [APP] get gift
 * @param req
 * @param res
 * @returns
 */
//TODO: add pagninate
export const getGifts = async (query: any) => {

    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const { count, rows } = await Bundles.findAndCountAll({
        where: {
            status: STATUS.ACTIVE
        },
        offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit,
        include: [
            {
                model: Files,
                as: 'imageURLs',
                separate: true
            }
        ],
        order: [["discount", "DESC"]],
        distinct: true
    })

    const results = rows.map(item => item.toDataGiftList());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] get gift detail
 * @param req
 * @param res
 * @returns
 */
export const getGiftDetail = async (query: any) => {
    const { id } = query;
    const gift = await Bundles.findOne({
        where: { id, status: STATUS.ACTIVE, }, include: [
            {
                model: ProductsBundles,
                as: 'product_bundle',
                include: [{
                    model: Products,
                    as: 'product',
                    include: ["regions"],
                }],
                separate: true
            },
            {
                model: Files,
                as: 'imageURLs',
                separate: true
            },
            "regions",
        ]
    });
    if (!gift) {
        return Promise.reject(GIFT_ERRORS.GIFT_NOT_FOUND());
    }
    const result = gift.toDataGiftDetail();
    return Promise.resolve(result);
}

/**
 * [ADMIN] create gift
 * @param req
 * @param res
 * @returns
 */
export const createGift = async (body: any) => {

    const { title, price, discount, thumbnail, images, products, alcoholics, url } = body;
    const productBundles = products.map((product: any) => {
        return {
            productId: product.productId,
            quantity: product.quantity
        }
    });
    const bundle = { title, price, discount, url, product_bundle: productBundles };

    const gift = await Bundles.create(bundle, {
        include: [
            {
                model: ProductsBundles,
                as: 'product_bundle'
            }
        ]
    });

    await RABBIT.sendDataToRabbit(JOB_NAME.SAVE_IMAGE_GIFT, { images, thumbnail, alcoholics, giftId: gift.id });

    return Promise.resolve(gift);
}

/**
 * [ADMIN] delete gift
 * @param req
 * @param res
 * @returns
 */
export const deleteGift = async (query: any) => {

    const { id } = query;

    const gift = await Bundles.findOne({ where: { id, status: STATUS.ACTIVE } });
    if (!gift) {
        return Promise.reject(GIFT_ERRORS.GIFT_NOT_FOUND());
    }
    await Bundles.update({ status: STATUS.DELETED }, { where: { id, status: STATUS.ACTIVE } })

    await Promise.all([
        RABBIT.sendDataToRabbit(JOB_NAME.SAVE_IMAGE_GIFT_DELETE, { gift }),
        RABBIT.sendDataToRabbit(JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETE, { gift }),
    ])
    return Promise.resolve({ mesages: "Delete successfully!" });
}

/**
 * [ADMIN] delete gifts
 * @param req
 * @param res
 * @returns
 */
export const deleteGifts = async (body: any) => {

    const { giftIds } = body;

    await Bundles.update({ status: STATUS.DELETED }, { where: { id: { [Op.in]: giftIds }, status: STATUS.ACTIVE } })

    await Promise.all([
        RABBIT.sendDataToRabbit(JOB_NAME.SAVE_IMAGE_GIFT_DELETES, { giftIds }),
        RABBIT.sendDataToRabbit(JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETES, { giftIds }),
    ])
    return Promise.resolve({ mesages: "Delete successfully!" });
}

/**
 * [ADMIN] edit gift
 * @param req
 * @param res
 * @returns
 */
export const editGift = async (body: any) => {

    const { giftId, title, price, discount, thumbnail, images, products, alcoholics, url } = body;
    // check Gift
    const gift = await Bundles.findOne({ where: { id: giftId, status: STATUS.ACTIVE } });
    if (!gift) {
        return Promise.reject(GIFT_ERRORS.GIFT_NOT_FOUND());
    }
    const update = Object.assign({}, { title, price, discount, url });
    await Bundles.update(update, { where: { id: giftId, status: STATUS.ACTIVE } })
    await Promise.all([
        RABBIT.sendDataToRabbit(JOB_NAME.SAVE_IMAGE_GIFT_EDIT, { images, thumbnail, alcoholics, gift }),
        RABBIT.sendDataToRabbit(JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_EDIT, { products, gift }),
    ])
    return Promise.resolve({ mesages: "Update successfully!" });
}

/**
 * [ADMIN] get gift detail
 * @param req
 * @param res
 * @returns
 */
export const getDetail = async (query: any) => {

    const { id } = query;

    const gift = await Bundles.findOne({
        where: { id, status: STATUS.ACTIVE }, include: ["imageURLs",
            {
                model: ProductsBundles,
                as: 'product_bundle',
                include: ['product'],
                separate: true
            },]
    });
    if (!gift) {
        return Promise.reject(GIFT_ERRORS.GIFT_NOT_FOUND());
    }
    return Promise.resolve(gift.toDataGiftDetailAdmin());
}

/**
 * [ADMIN] get list gift
 * @param req
 * @param res
 * @returns
 */
export const getGiftAdmin = async (query: any) => {
    const { name } = query;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const order = query?.order === 'DESC' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
    const where = !!name ? { title: { [Op.like]: `%${name}%` }, status: STATUS.ACTIVE } : { status: STATUS.ACTIVE };
    const { count, rows } = await Bundles.findAndCountAll({
        where, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: order as any, include: [
            {
                model: ProductsBundles,
                as: 'product_bundle',
                include: ['product'],
                separate: true
            }
        ],
        distinct: true
    })
    const results = rows.map(item => item.toDataGiftDetailAdminDashboard());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ gifts: results, metaData });
}

/**
 * [ADMIN] get gift detail
 * @param req
 * @param res
 * @returns
 */
export const searchGiftViaName = async (query: any) => {
    const { name } = query;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const order = query?.order === 'DESC' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
    const where = !!name ? { title: { [Op.like]: `%${name}%` }, status: STATUS.ACTIVE } : { status: STATUS.ACTIVE };
    const { count, rows } = await Bundles.findAndCountAll({
        where, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: order as any, include: [
            {
                model: ProductsBundles,
                as: 'product_bundle',
                include: ['product'],
                separate: true
            }
        ],
        distinct: true
    })
    const results = rows.map(item => item.toDataGiftDetailAdminDashboard());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ gifts: results, metaData });
}