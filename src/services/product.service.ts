import Products from "../models/products.model";
import RABBIT from "../libs/rabbitmq/init";
import { JOB_NAME, KeywordType, STATUS } from "../utils/const";
import Sequelize from "sequelize";
import KeyWordProducts from "../models/keywordProducts.model";
import TasteEvaluations from "../models/tasteEvaluation.model";
import SnackProducts from "../models/snacksProducts.model";
import { KEYWORD_ERRORS, PRODUCT_ERRORS, REGION_ERRORS, USER_ERRORS } from "../utils/errorMessages";
import { pagination } from "../utils/common";
import Snacks from "../models/snacks.model";
import Users from "../models/users.model";
import Keywords from "../models/keywords.model";
import SearchHistories from "../models/searchHistories.model";
import Regions from "../models/regions.model";
import ProductsCategories from "../models/productsCategories.model";
import Files from "../models/files.model";
const { Op, literal } = Sequelize;

/**
 * [ADMIN] create product
 * @param req
 * @param res
 * @returns
 */
export const createProduct = async (body: any) => {
    const { title, thumbnail, description, keywords, tastes, snacks, region, brewery, categories, concentration, price, discount, images, url, district } = body;

    // tslint:disable-next-line: variable-name
    const keyword_product = keywords.map(({ keywordId, highlight }: any) => ({ keywordId, highlight: highlight ? 1 : 0 }));
    // tslint:disable-next-line: variable-name
    const taste_evaluations = tastes.map((item: any) => ({ tasteId: item.id, score: item.score }));
    // tslint:disable-next-line: variable-name
    const snack_product = snacks.map((item: any) => ({ snackId: item.id, content: item.content }));
    // tslint:disable-next-line: variable-name
    const product_categories = categories.map((item: any) => ({ categoryId: item }));

    const productBody = { title, description, district, region, brewery, concentration, price, discount, url, product_categories, keyword_product, taste_evaluations, snack_product };
    const product = await Products.create(productBody, {
        include: [
            {
                model: KeyWordProducts,
                as: 'keyword_product'
            },
            {
                model: TasteEvaluations,
                as: 'taste_evaluations'
            },
            {
                model: SnackProducts,
                as: 'snack_product'
            },
            {
                model: ProductsCategories,
                as: 'product_categories'
            }
        ]
    });
    await RABBIT.sendDataToRabbit(JOB_NAME.SAVE_PRODUCT_CREATE, { thumbnail, images, product });
    return Promise.resolve(product);
}

/**
 * [ADMIN] edit product
 * @param req
 * @param res
 * @returns
 */
export const editProduct = async (body: any) => {
    const { productId, title, thumbnail, description, keywords, tastes, snacks, region, district, brewery, categories, concentration, price, discount, images, url } = body;

    const checkProduct = await Products.findOne({ where: { id: productId, status: STATUS.ACTIVE } });
    if (!checkProduct) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    // tslint:disable-next-line: variable-name
    const keyword_product = keywords.map(({ keywordId, highlight }: any) => ({ productId, keywordId, highlight: highlight ? 1 : 0 }));
    // tslint:disable-next-line: variable-name
    const taste_evaluations = tastes.map((item: any) => ({ tasteId: item.id, score: item.score, productId }));
    // tslint:disable-next-line: variable-name
    const snack_product = snacks.map((item: any) => ({ snackId: item.id, content: item.content, productId }));
    // tslint:disable-next-line: variable-name
    const product_categories = categories.map((item: any) => ({ categoryId: item, productId }));

    const update = Object.assign({}, { title, description, region, brewery, concentration, price, discount, url, district });

    await Products.update(update, { where: { id: productId, status: STATUS.ACTIVE } })
    await RABBIT.sendDataToRabbit(JOB_NAME.SAVE_PRODUCT_EDIT, { thumbnail, images, productId, keyword_product, taste_evaluations, snack_product, product_categories });
    return Promise.resolve({ mesages: "Update successfully!" });
}

/**
 * [ADMIN] delete product
 * @param req
 * @param res
 * @returns
 */
export const deleteProduct = async (query: any) => {
    const { productId } = query;
    const checkProduct = await Products.findOne({ where: { id: productId, status: STATUS.ACTIVE } });
    if (!checkProduct) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }

    await Products.update({ status: STATUS.DELETED }, { where: { id: productId, status: STATUS.ACTIVE } })
    await RABBIT.sendDataToRabbit(JOB_NAME.SAVE_PRODUCT_DELETE, { productId });
    return Promise.resolve({ mesages: "Delete successfully!" });
}

/**
 * [ADMIN] search product via name
 * @param req
 * @param res
 * @returns
 */
export const searchProductViaName = async (query: any) => {
    const { name } = query;
    const products = await Products.findAll({
        where: { title: { [Op.like]: `%${name}%` }, status: STATUS.ACTIVE }, include: [
            {
                model: KeyWordProducts,
                as: 'keyword_product',
                include: ['keyword'],
                separate: true
            },
            {
                model: TasteEvaluations,
                as: 'taste_evaluations',
                include: ['taste'],
                separate: true
            },
            {
                model: ProductsCategories,
                as: 'product_categories',
                include: ['category'],
                separate: true
            },
            'regions',
            'districts'
        ]
    });
    const results = products.map(item => item.toDetailAdminDashboard());
    return Promise.resolve(results);
}

/**
 * [APP] get product detail
 * @param req
 * @param res
 * @returns
 */
export const getProductDetail = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const { id } = query;
    const product = await Products.findOne({
        where: { id, status: STATUS.ACTIVE },
        include: [
            {
                model: KeyWordProducts,
                as: 'keyword_product',
                include: ['keyword'],
                separate: true
            },
            {
                model: TasteEvaluations,
                as: 'taste_evaluations',
                include: ['taste'],
                separate: true
            },
            {
                model: SnackProducts,
                as: 'snack_product',
                include: [{
                    model: Snacks,
                    as: 'snack',
                    include: ["imageUrl"],
                }],
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
            'districts',
        ],
        attributes: {
            include: [
                [literal(`(SELECT COUNT(*) from products_likes as r where r.userId = ${userId} AND r.productId = Products.id)`), 'isLike'],
            ],
        },
    })
    if (!product) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    const result = product.toDataProductDetail();
    return Promise.resolve(result);
}

/**
 * [ADMIN] GET ALL product
 * @param req
 * @param res
 * @returns
 */
export const getListAll = async () => {
    const products = await Products.findAll({ where: { status: STATUS.ACTIVE } });
    return Promise.resolve(products);
}

/**
 * [ADMIN] get product detail
 * @param req
 * @param res
 * @returns
 */
export const getProductDetailAdmin = async (query: any) => {
    const { id } = query;
    const product = await Products.findOne({
        where: { id, status: STATUS.ACTIVE },
        include: [
            {
                model: KeyWordProducts,
                as: 'keyword_product',
                include: ['keyword'],
                separate: true
            },
            {
                model: TasteEvaluations,
                as: 'taste_evaluations',
                include: ['taste'],
                separate: true
            },
            {
                model: SnackProducts,
                as: 'snack_product',
                include: ['snack'],
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
        ]
    })
    if (!product) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    return Promise.resolve(product.toDetailAdmin());
}

/**
 * [ADMIN] GET  products
 * @param req
 * @param res
 * @returns
 */
export const getList = async (query: any) => {
    const { name } = query;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const order = query?.order === 'DESC' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
    const where = !!name ? { title: { [Op.like]: `%${name}%` }, status: STATUS.ACTIVE } : { status: STATUS.ACTIVE };
    const { count, rows } = await Products.findAndCountAll({
        where, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: order as any, include: [
            {
                model: KeyWordProducts,
                as: 'keyword_product',
                include: ['keyword'],
                separate: true
            },
            {
                model: TasteEvaluations,
                as: 'taste_evaluations',
                include: ['taste'],
                separate: true
            },
            {
                model: ProductsCategories,
                as: 'product_categories',
                include: ['category'],
                separate: true
            },
            'regions',
            'districts'
        ],
        distinct: true
    })
    const results = rows.map(item => item.toDetailAdminDashboard());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] GET  total click product
 * @param req
 * @param res
 * @returns
 */
export const updateTotalClick = async (query: any) => {
    const { id } = query;
    const product = await Products.findOne({ where: { id, status: STATUS.ACTIVE } });
    if (!product) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    await Products.update({ totalClick: literal('totalClick+1') }, { where: { id, status: STATUS.ACTIVE } })
    return Promise.resolve({ message: "Update total click Successfully" });
}

/**
 * [APP] GET recommend  products 
 * @param req
 * @param res
 * @returns
 */
export const getRecommendProducts = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const order = query?.order || 'DESC';
    const filter = query?.filter || 'totalLike';
    const filterQuery = [[filter, order]]
    const { count, rows } = await Products.findAndCountAll({
        where: { isRecommend: 1, status: STATUS.ACTIVE }, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: filterQuery as any, include: [
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
        distinct: true
    })
    const results = rows.map(item => item.toProductIsRecommend());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] search product via product name or company name
 * @param req
 * @param res
 * @returns
 */
export const searchProductByName = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const name = query?.name;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const keyword = await Keywords.findOne({ where: { content: name, status: STATUS.ACTIVE } })
    if (!keyword) {
        const newKeyword = await Keywords.create({
            content: name,
            type: KeywordType.SEARCH
        })
        await newKeyword.update({ totalSearch: literal('totalSearch+1') })
        const history = await SearchHistories.findOne({ where: { userId, keywordId: newKeyword.id } });
        if (!history) {
            await SearchHistories.create({ userId, keywordId: newKeyword.id });
        }
    } else {
        await keyword.update({ totalSearch: literal('totalSearch+1') })
        const history = await SearchHistories.findOne({ where: { userId, keywordId: keyword.id } });
        if (!history) {
            await SearchHistories.create({ userId, keywordId: keyword.id });
        }
    }
    const { count, rows } = await Products.findAndCountAll({
        where: {
            [Op.or]: [
                { title: { [Op.like]: `%${name}%` } },
                { brewery: { [Op.like]: `%${name}%` } }
            ],
            status: STATUS.ACTIVE
        },
        offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit,
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
        distinct: true
    });
    if (!rows) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    const results = rows.map(item => item.toProductIsRecommend());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] GET filtered products
 * @param req
 * @param res
 * @returns
 */
export const getFilteredProducts = async (req: any) => {
    const { body, query } = req;
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const categoryIds = body?.categoryIds;
    const priceIds = body?.priceIds;
    const concentrationIds = body?.concentrationIds;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const filter = query?.filter || 'totalLike';
    const order = query?.order || 'DESC';

    const categoryCons = categoryIds.map((id: number) => { return `pc.categoryId = ${id}` });
    const priceCons = priceIds.map((id: number) => { return `pc.categoryId = ${id}` });
    const concenCons = concentrationIds.map((id: number) => { return `pc.categoryId = ${id}` });

    const { count, rows } = await Products.findAndCountAll({
        where: {
            [Op.and]: [
                !!categoryCons.length && literal(`EXISTS (SELECT '' FROM products_categories as pc WHERE (${categoryCons.join(' OR ')}) AND pc.productId = Products.id)`),
                !!priceCons.length && literal(`EXISTS (SELECT '' FROM products_categories as pc WHERE (${priceCons.join(' OR ')}) AND pc.productId = Products.id)`),
                !!concenCons.length && literal(`EXISTS (SELECT '' FROM products_categories as pc WHERE (${concenCons.join(' OR ')}) AND pc.productId = Products.id)`),
            ],
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
                [literal('Products.price - ((Products.price * Products.discount) / 100)'), 'discountPrice'],
            ],
        },
        order: [[literal(`${filter}`), order]],
        distinct: true
    });
    if (!rows) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    const results = rows.map(item => item.toDataProductDetail());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] GET   products by popular search
 * @param req
 * @param res
 * @returns
 */
export const getProductsByPopularSearch = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const keywordId = query?.keywordId;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const keyword = await Keywords.findOne({ where: { id: keywordId, status: STATUS.ACTIVE } });
    if (!keyword) {
        return Promise.reject(KEYWORD_ERRORS.KEYWORD_NOT_FOUND());
    }
    await keyword.update({ totalSearch: literal('totalSearch+1') })
    const { count, rows } = await Products.findAndCountAll({
        where: {
            [Op.or]: [
                { title: { [Op.like]: `%${keyword.content}%` } },
                { brewery: { [Op.like]: `%${keyword.content}%` } }
            ],
            status: STATUS.ACTIVE
        }, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit,
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
        distinct: true
    })
    if (!rows) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    const results = rows.map(item => item.toProductIsRecommend());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] GET products by popular search on Admin
 * @param req
 * @param res
 * @returns
 */
export const getProductsByPopularSearchAdmin = async (req: any) => {
    const query = req.query;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const keywordId = query?.keywordId;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const keyword = await Keywords.findOne({ where: { id: keywordId, status: STATUS.ACTIVE } });
    if (!keyword) {
        return Promise.reject(KEYWORD_ERRORS.KEYWORD_NOT_FOUND());
    }
    const { count, rows } = await Products.findAndCountAll({
        where: { status: STATUS.ACTIVE }, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, include: [
            {
                model: KeyWordProducts,
                as: 'keyword_product',
                include: ['keyword'],
                where: { keywordId },
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
    })
    const results = rows.map(item => item.toProductIsRecommend());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] GET recommned gift  products 
 * @param req
 * @param res
 * @returns
 */
export const getRecommnedGiftProducts = async (req: any) => {
    const body = req.body;
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const categoryIds = body?.categoryIds;
    const ageIds = body?.ageIds;
    const typeIds = body?.typeIds;
    const concentrationIds = body?.concentrationIds;
    const limit = body?.limit || 10;
    const offset = body?.offset || 0;

    const categoryCons = categoryIds.map((id: number) => { return `pc.categoryId = ${id}` });
    const ageCons = ageIds.map((id: number) => { return `pc.categoryId = ${id}` });
    const typeCons = typeIds.map((id: number) => { return `pc.categoryId = ${id}` });
    const concenCons = concentrationIds.map((id: number) => { return `pc.categoryId = ${id}` });
    const { count, rows } = await Products.findAndCountAll({
        where: {
            [Op.and]: [
                !!categoryCons.length && literal(`EXISTS (SELECT '' FROM products_categories as pc WHERE (${categoryCons.join(' OR ')}) AND pc.productId = Products.id)`),
                !!ageCons.length && literal(`EXISTS (SELECT '' FROM products_categories as pc WHERE (${ageCons.join(' OR ')}) AND pc.productId = Products.id)`),
                !!typeCons.length && literal(`EXISTS (SELECT '' FROM products_categories as pc WHERE (${typeCons.join(' OR ')}) AND pc.productId = Products.id)`),
                !!concenCons.length && literal(`EXISTS (SELECT '' FROM products_categories as pc WHERE (${concenCons.join(' OR ')}) AND pc.productId = Products.id)`),
            ],
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
        distinct: true
    });
    if (!rows) {
        return Promise.reject(PRODUCT_ERRORS.PRODUCT_NOT_FOUND());
    }
    const results = rows.map(item => item.toDataProductDetail());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}

/**
 * [APP] GET  products by region
 * @param req
 * @param res
 * @returns
 */
export const getProductsByRegion = async (req: any) => {
    const query = req.query;
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const regionId = query?.regionId;
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const region = await Regions.findOne({ where: { id: regionId, status: STATUS.ACTIVE } });
    if (!region) {
        return Promise.reject(REGION_ERRORS.REGION_NOT_FOUND());
    }
    const { count, rows } = await Products.findAndCountAll({
        where: { status: STATUS.ACTIVE }, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: [['totalLike', 'DESC']], include: [
            {
                model: Regions,
                as: 'regions',
                where: { id: regionId }
            },
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
            'districts',
        ],
        attributes: {
            include: [
                [literal(`(SELECT COUNT(*) from products_likes as r where r.userId = ${userId} AND r.productId = Products.id)`), 'isLike'],
            ],
        },
        distinct: true
    })
    const results = rows.map(item => item.toProductIsRecommend());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ products: results, metaData });
}
