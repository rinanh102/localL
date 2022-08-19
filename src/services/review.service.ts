import { USER_ERRORS, REVIEW_ERRORS, PRODUCT_ERRORS } from "../utils/errorMessages";
import Reviews from "../models/reviews.model";
import RABBIT from "../libs/rabbitmq/init";
import { JOB_NAME, STATUS } from "../utils/const";
import * as paginate from "../utils/custom-paginate";
import ReviewLikes from "../models/reviewsLikes.model";
import Users from "../models/users.model";
import Products from "../models/products.model";
import { pagination } from "../utils/common";
import Sequelize from "sequelize";
import UserSettings from "../models/userSettings.model";
const { Op, literal } = Sequelize;

/**
 * [APP] get reviews of product
 * @param  {Object} 
 * @returns {Promise}
 */
export const getReviewsOfProduct = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const { productId, page, size } = query;
    const { limit, offset } = paginate.getPagination(page, size);
    const reviews = await Reviews.findAndCountAll({
        limit,
        offset: offset > 0 ? (offset - 1) * limit : offset,
        where: {
            productId,
            status: STATUS.ACTIVE,
        },
        include: [
            'user',
            'imageUrl'
        ],
        attributes: {
            include: [
                [literal(`(SELECT COUNT(*) from reviews_likes as r where r.userId = ${userId} AND r.reviewId = Reviews.id)`), 'isLike'],
            ],
        },
        order: [["createdAt", "DESC"]],
        distinct: true
    });
    const reviewsData = reviews.rows.map((data: any) => data.toDataReview());
    const result = paginate.getPagingData(reviewsData, reviews.count, page, limit);
    return Promise.resolve(result);
}

/**
* [APP] get all reviews of product
* @param  {Object} 
* @returns {Promise}
*/
export const getAllReviewsOfProduct = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const { productId } = query;

    const reviews = await Reviews.findAll({
        where: {
            productId,
            status: STATUS.ACTIVE,
        },
        include: [
            'user',
            'imageUrl'
        ],
        attributes: {
            include: [
                [literal(`(SELECT COUNT(*) from reviews_likes as r where r.userId = ${userId} AND r.reviewId = Reviews.id)`), 'isLike'],
            ],
        },
        order: [["createdAt", "DESC"]]

    });
    const reviewsData = reviews.map((data: any) => data.toDataReview());
    return Promise.resolve(reviewsData);
}

/**
* [APP] create review
* @param  {Object}
* @returns {Promise}
*/
export const createReview = async (req: any) => {
    const body = req.body;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    if (!user.name) {
        return Promise.resolve(USER_ERRORS.USER_NAME_NOT_FOUND());
    }
    const { content, productId, image } = body
    const product = await Products.findOne({ where: { id: productId, status: STATUS.ACTIVE } });
    if (!product) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }

    const reviewBody = { content, productId, userId, image };
    const reviews = await Reviews.findOne({ where: { productId, userId, status: STATUS.ACTIVE } });
    if (!reviews) {
        await Promise.all([
            Reviews.create(reviewBody),
            UserSettings.update({ totalReview: literal('totalReview+1') }, { where: { userId, status: STATUS.ACTIVE } })
        ])
    } else {
        await Reviews.create(reviewBody)
    }
    return Promise.resolve({ message: "Review create successfully!" });
}

/**
 * [ADMIN] delete review
 * @param  {Object}
 * @returns {Promise}
 */
export const deleteReview = async (query: any) => {
    const { id } = query;
    const review = await Reviews.findOne({ where: { id, status: STATUS.ACTIVE } });
    if (!review) {
        return Promise.reject(REVIEW_ERRORS.REVIEW_NOT_FOUND());
    }
    await Reviews.update({ status: STATUS.DELETED }, { where: { id, status: STATUS.ACTIVE } });
    await RABBIT.sendDataToRabbit(JOB_NAME.DELETE_RELATION_REVIEW, { review })
    return Promise.resolve({ mesages: "Delete successfully!" });
};

/**
 * [ADMIN] get detail review
 * @param  {Object}
 * @returns {Promise}
 */
export const getDetailReview = async (query: any) => {
    const { id } = query;
    const review = await Reviews.findOne({
        where: { id, status: STATUS.ACTIVE }, include: ['user',
            'imageUrl', 'product']
    });
    if (!review) {
        return Promise.reject(REVIEW_ERRORS.REVIEW_NOT_FOUND());
    }
    return Promise.resolve(review.toDetailReviewAdmin());
};

/**
 * [ADMIN] delete review multiple
 * @param  {Object}
 * @returns {Promise}
 */
export const deleteReviews = async (body: any) => {
    const { reviewIds } = body;
    await Promise.all([
        Reviews.update({ status: STATUS.DELETED }, { where: { id: { [Op.in]: reviewIds }, status: STATUS.ACTIVE } }),
        ReviewLikes.destroy({ where: { reviewId: { [Op.in]: reviewIds }, status: STATUS.ACTIVE } })
    ]);
    await RABBIT.sendDataToRabbit(JOB_NAME.DELETE_RELATION_REVIEWS, { reviewIds })
    return Promise.resolve({ mesages: "Delete successfully!" });
};

/**
 * [ADMIN] get reviews of product
 * @param  {Object} 
 * @returns {Promise}
 */
export const getReviewsOfProductAdmin = async (req: any) => {
    const query = req.query;
    const { productId, key } = query;
    const fromDate = !!query.fromDate && new Date(query.fromDate)
    const toDate = !!query.toDate && new Date(query.toDate)
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const order = query?.order === 'DESC' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
    // const search = !!key ? { content: { [Op.like]: `%${key}%` } } : {}
    const con = !!productId ? { productId, status: STATUS.ACTIVE } : { status: STATUS.ACTIVE };
    const where = !!fromDate ? {
        ...con, createdAt: {
            [Op.and]: {
                [Op.gte]: fromDate.toISOString(),
                [Op.lte]: toDate.toISOString(),
            }
        }
    } : con;
    let count: any = 0;
    let rows: any[] = [];
    if (!key) {
        ({ count, rows } = await Reviews.findAndCountAll({
            where, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: order as any, include: [
                'user',
                'imageUrl',
                'product'
            ],
            distinct: true
        }))
    } else {
        ({ count, rows } = await Reviews.findAndCountAll({
            where: {
                ...where,
                [Op.or]: [
                    { '$user.name$':  { [Op.like]: `%${key}%` } },
                    { '$product.title$':  { [Op.like]: `%${key}%` } }
                ]
            },
            offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: order as any, include: [
                {
                    model: Users,
                    as: 'user',
                },
                'imageUrl',
                {
                    model: Products,
                    as: 'product',
                }
            ],
            distinct: true
        }))
    }
    if (count && rows) {
        const metaData = await pagination(count, +offset, limit, rows.length);
        const results = rows.map((item: any) => item.toDetailReviewAdmin());
        return Promise.resolve({ reviews: results, metaData });
    }
}