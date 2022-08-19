import ProductLikes from "../models/productsLikes.model";
import { STATUS } from "../utils/const";
import { USER_ERRORS, PRODUCT_ERRORS, REVIEW_ERRORS, CATEGORY_ERRORS } from "../utils/errorMessages";
import ReviewLikes from "../models/reviewsLikes.model";
import CategoryProfiles from "../models/categoriesProfile.model";
import Products from "../models/products.model";
import Sequelize from "sequelize";
import Users from "../models/users.model";
import Reviews from "../models/reviews.model";
import Categories from "../models/categories.model";
import UserSettings from "../models/userSettings.model";

const { literal } = Sequelize;

/**
 * [APP] update product like
 * @param  {Object} 
 * @returns {Promise}
 */
export const updateProductLike = async (req: any) => {
    const query = req.query;
    const { productId } = query;
    const product = await Products.findOne({ where: { id: productId, status: STATUS.ACTIVE } });
    if (!product) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const like = await ProductLikes.findOne({ where: { productId, userId } })

    if (!like) {
        await Promise.all([
            ProductLikes.create({ productId, userId }),
            Products.update({ totalLike: literal('totalLike+1') }, { where: { id: productId, status: STATUS.ACTIVE } }),
            UserSettings.update({ totalLike: literal('totalLike+1') }, { where: { userId, status: STATUS.ACTIVE } })
        ])
        return Promise.resolve({ mesages: "Like successfully!" });
    }
    await Promise.all([
        ProductLikes.destroy({ where: { productId, userId } }),
        Products.update({ totalLike: literal('totalLike-1') }, { where: { id: productId, status: STATUS.ACTIVE } }),
        UserSettings.update({ totalLike: literal('totalLike-1') }, { where: { userId, status: STATUS.ACTIVE } })
    ])
    return Promise.resolve({ mesages: "Unlike successfully!" });
}

/**
 * [APP] update review like
 * @param  {Object} 
 * @returns {Promise}
 */
export const updateReviewLike = async (req: any) => {
    const query = req.query;
    const { reviewId } = query;
    const review = await Reviews.findOne({ where: { id: reviewId, status: STATUS.ACTIVE } });
    if (!review) {
        return Promise.reject(REVIEW_ERRORS.REVIEW_NOT_FOUND());
    }

    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const like = await ReviewLikes.findOne({ where: { reviewId, userId } })
    if (!like) {
        await Promise.all([
            ReviewLikes.create({ reviewId, userId }),
            Reviews.update({ totalLike: literal('totalLike+1') }, { where: { id: reviewId, status: STATUS.ACTIVE } })

        ])
        return Promise.resolve({ mesages: "Like successfully!" });
    }
    await Promise.all([
        ReviewLikes.destroy({ where: { reviewId, userId } }),
        Reviews.update({ totalLike: literal('totalLike-1') }, { where: { id: reviewId, status: STATUS.ACTIVE } })

    ])
    return Promise.resolve({ mesages: "Unlike successfully!" });
}

/**
 * [APP] update category like
 * @param  {Object} 
 * @returns {Promise}
 */
export const updateCategoryLike = async (req: any) => {
    const query = req.query;
    const { categoryId } = query;
    const category = await Categories.findOne({ where: { id: categoryId, status: STATUS.ACTIVE } });
    if (!category) {
        return Promise.reject(CATEGORY_ERRORS.CATEGORY_NOT_FOUND());
    }
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const like = await CategoryProfiles.findOne({ where: { categoryId, userId } })
    if (!like) {
        const newLike = await CategoryProfiles.create({ categoryId, userId });
        return Promise.resolve({ mesages: "Like successfully!" });
    }
    await CategoryProfiles.destroy({ where: { categoryId, userId } })

    return Promise.resolve({ mesages: "Unlike successfully!" });
}