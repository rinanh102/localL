import Sequelize, { QueryTypes } from "sequelize";
import Users from "../models/users.model";
import { ROLE_USER, STATUS } from "../utils/const";
import Reviews from "../models/reviews.model";
import Bundles from "../models/bundles.model";
import Products from "../models/products.model";
import ProductsBundles from "../models/productsBundles.model";
import KeyWordProducts from "../models/keywordProducts.model";
import TasteEvaluations from "../models/tasteEvaluation.model";
import ProductsCategories from "../models/productsCategories.model";
const { Op } = Sequelize;

/**
 * [ADMIN] member graphs
 * @param req
 * @param res
 * @returns
 */
export const getMemberGraphs = async (query: any) => {
    const fromDate: any = !!query.fromDate && new Date(query.fromDate);
    // const toDate: any = !!query.toDate && new Date(query.toDate);
    // const numInDay = Math.floor((toDate - fromDate) / (24 * 3600 * 1000));
    const numInDay = 7;
    const total = await Users.count({ where: { createdAt: { [Op.lt]: fromDate }, status: STATUS.ACTIVE } });
    const sums: any[] = [];
    const startDate = fromDate.toISOString().split('T')[0];
    for (let index = 0; index < numInDay; index++) {
        if (index === 0) {
            const date: any = new Date(fromDate.setDate(fromDate.getDate())).toISOString();
            const s = `SUM(DATE(u.createdAt) BETWEEN "${startDate}" AND "${date.split('T')[0]}") as "${date.split('T')[0]}"`
            sums.push(s)
            continue;
        }
        const date: any = new Date(fromDate.setDate(fromDate.getDate() + 1)).toISOString();
        const s = `SUM(DATE(u.createdAt) BETWEEN "${startDate}" AND "${date.split('T')[0]}") as "${date.split('T')[0]}"`
        sums.push(s)

    }
    const sql: any = `SELECT ${sums.join(',')} from users as u where u.status = 1;`
    const rUsers = await Users.sequelize.query(sql, { type: QueryTypes.SELECT });
    const users: any = rUsers && rUsers[0]
    const keys = Object.keys(users);
    if (keys) {
        const results = keys.map((key: any) => {
            return {
                count: +total + +users[key],
                date: key
            };
        })
        return Promise.resolve(results);
    }
    return Promise.resolve([]);
}

/**
 * [ADMIN] reviews
 * @param req
 * @param res
 * @returns
 */
export const getReviews = async () => {
    const reviews = await Reviews.findAll({
        where: { status: STATUS.ACTIVE },
        limit: 6,
        order: [['createdAt', 'DESC']],
        include: ['user']
    });
    const results = reviews.map(item => item.toDataDashBoard());
    return Promise.resolve(results);
}

/**
 * [ADMIN] GIFTS
 * @param req
 * @param res
 * @returns
 */
export const getGifts = async () => {
    const gifts = await Bundles.findAll({
        where: { status: STATUS.ACTIVE },
        limit: 5,
        order: [['totalClick', 'DESC']],
        include: [
            {
                model: ProductsBundles,
                as: 'product_bundle',
                include: ['product'],
                separate: true
            }
        ]
    });
    const results = gifts.map(item => item.toDataGiftDetailAdminDashboard());
    return Promise.resolve(results);
}

/**
 * [ADMIN] reviews
 * @param req
 * @param res
 * @returns
 */
export const getProducts = async () => {
    const products = await Products.findAll({
        where: { status: STATUS.ACTIVE },
        limit: 5,
        order: [['totalClick', 'DESC']],
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
 * [ADMIN] reviews
 * @param req
 * @param res
 * @returns
 */
export const searchDashBoard = async (query: any) => {
    const { key } = query;
    const [giftMap, productMap, memberMap] = await Promise.all([
        Bundles.findAll({ where: { title: { [Op.like]: `%${key}%` }, status: STATUS.ACTIVE } }),
        Products.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${key}%` } },
                    { brewery: { [Op.like]: `%${key}%` } }
                ], status: STATUS.ACTIVE
            }
        }),
        Users.findAll({
            where: {
                [Op.or]: [
                    {
                        name: { [Op.like]: `%${key}%` },
                    },
                    {
                        nickname: { [Op.like]: `%${key}%` }
                    },
                    {
                        email: { [Op.like]: `%${key}%` }
                    }
                ], status: STATUS.ACTIVE, role: ROLE_USER.USER
            }
        })
    ]);
    const gifts = giftMap.map((gift: any) => {
        return {
            name: `선물 관리 > 주류 선물 > ${gift.title}`,
            routerLink: `product-management/detail-gift/${gift.id}`
        }
    });
    const products = productMap.map((product: any) => {
        return {
            name: `상품 관리 > 주류 상품 > ${product.title}`,
            routerLink: `product-management/detail-product/${product.id}`
        }
    });
    const members = memberMap.map((member: any) => {
        return {
            name: `회원관리 > 상세 정보 > ${member.name}`,
            routerLink: `member-management/detail/${member.id}`
        }
    });
    return Promise.resolve({ gifts, products, members });
}