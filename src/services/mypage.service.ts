import Users from "../models/users.model";
import { USER_ERRORS } from "../utils/errorMessages";
import { JOB_NAME, STATUS } from "../utils/const";
import { pagination } from "../utils/common";
import Products from "../models/products.model";
import KeyWordProducts from "../models/keywordProducts.model";
import BCRYPT from "bcrypt";
import RABBIT from "../libs/rabbitmq/init";
import Sequelize from "sequelize";
import Files from "../models/files.model";
import ProductLikes from "../models/productsLikes.model";
import ProductsCategories from "../models/productsCategories.model";
import CategoryProfiles from "../models/categoriesProfile.model";
import UserSettings from "../models/userSettings.model";
const { Op, literal } = Sequelize;

/**
 * [APP] My like list
 * @param req
 * @param res
 * @returns
 */
export const getMyLikeList = async (req: any) => {
    const query = req.query;

    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;

    const { count, rows } = await Products.findAndCountAll(
        {
            where: { status: STATUS.ACTIVE },
            offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit,
            include: [
                {
                    model: KeyWordProducts,
                    as: 'keyword_product',
                    include: ['keyword'],
                    separate: true
                },
                {
                    model: ProductLikes,
                    as: 'productLike',
                    where: { userId },
                },
                {
                    model: ProductsCategories,
                    as: 'product_categories',
                    include: ['category'],
                    separate: true
                },
                {
                    model: Files,
                    as: 'imageURLs',
                    separate: true
                },
                'regions',
                'districts'
            ],
            attributes: {
                include: [
                    [literal(`(SELECT COUNT(*) from products_likes as r where r.userId = ${userId} AND r.productId = Products.id)`), 'isLike'],
                ],
            },
            distinct: true
        });

    const results = rows.map(item => item.toProductIsRecommend());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] My reviewed products list
 * @param req
 * @param res
 * @returns
 */
export const getMyViewList = async (req: any) => {
    const query = req.query;
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const { count, rows } = await Products.findAndCountAll({
        where: {
            id: { [Op.in]: literal(`(SELECT productId from reviews as r where r.userId = ${userId} GROUP BY r.productId)`) },
            status: STATUS.ACTIVE
        },
        offset: offset > 0 ? (offset - 1) * limit : offset,
        limit: +limit,
        include: [
            {
                model: KeyWordProducts,
                as: 'keyword_product',
                include: ['keyword'],
                separate: true
            },
            {
                model: ProductsCategories,
                as: 'product_categories',
                include: ['category'],
                separate: true
            },
            {
                model: Files,
                as: 'imageURLs',
                separate: true
            },
            'regions',
            'districts'
        ],
        attributes: {
            include: [
                [literal(`(SELECT COUNT(*) from products_likes as r where r.userId = ${userId} AND r.productId = Products.id)`), 'isLike'],
            ],
        },
        distinct: true,
    });
    const results = rows.map(item => item.toDataProductDetail());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] Get My Detail
 * @param req
 * @param res
 * @returns
 */
export const getMyDetail = async (req: any) => {
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });

    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }

    const member = await Users.findOne({
        where: { id: userId, status: STATUS.ACTIVE },
        include: [
            {
                model: CategoryProfiles,
                include: ['category'],
                as: 'category_profile',
                separate: true
            },
            'avatarUrl',
            'setting'
        ]
    });
    if (!member) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    return Promise.resolve(member.toUserMyDetail());
}

/**
 * [APP] Edit Profile
 * @param req
 * @param res
 * @returns
 */
export const editProfile = async (req: any) => {
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });

    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }

    const { avatar, newPassword, phoneNumber, name, nickname, categories, gender, age } = req.body;
    if (nickname) {
        const checkNickname = await Users.findOne({ where: { nickname, status: STATUS.ACTIVE } });
        if (checkNickname) {
            return Promise.reject(USER_ERRORS.NICKNAME_ALREADY_EXIST());
        }
    }

    if (phoneNumber) {
        const checkPhoneNumber = await Users.findOne({ where: { phoneNumber, status: STATUS.ACTIVE } });
        if (checkPhoneNumber) {
            return Promise.reject(USER_ERRORS.PHONE_ALREADY_EXIST());
        }
    }

    if (avatar !== user.avatar) {
        Files.update({ status: STATUS.DELETED }, { where: { id: user.avatar } })
    }

    // tslint:disable-next-line: variable-name
    const categories_profile = categories && categories.map((item: any) => ({ categoryId: item, userId }));

    let update = Object.assign({}, { avatar, phoneNumber, name, nickname, gender, age });
    if (newPassword) {
        const salt = await BCRYPT.genSalt(10);
        const password = await BCRYPT.hash(newPassword, salt);
        update = Object.assign(update, { password });
    }

    await Users.update(update, { where: { id: userId, status: STATUS.ACTIVE } });
    await RABBIT.sendDataToRabbit(JOB_NAME.SAVE_USER_EDIT, { categories_profile, userId });

    return Promise.resolve({ mesages: "Update successfully!" });
}

/**
 * [APP] Update Notification
 * @param req
 * @param res
 * @returns
 */
export const updateNotification = async (req: any) => {
    const { notification } = req.body;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    await UserSettings.update({ notification }, { where: { userId, status: STATUS.ACTIVE } })
    return Promise.resolve({ mesages: "Update successfully!" });
}