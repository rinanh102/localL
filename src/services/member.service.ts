import RABBIT from "../libs/rabbitmq/init";
import { GENDER, JOB_NAME, ROLE_USER, STATUS } from "../utils/const";
import Sequelize, { QueryTypes } from "sequelize";
import Users from "../models/users.model";
import { pagination } from "../utils/common";
import { USER_ERRORS } from "../utils/errorMessages";
import CategoryProfiles from "../models/categoriesProfile.model";
const { Op } = Sequelize;

const getAgeTotal = async (date: any) => {
    const count = await Users.count({ where: { createdAt: { [Op.lte]: date }, status: STATUS.ACTIVE }, group: ['age'] });
    const age = { '20': 0, '30': 0, '40': 0, '50': 0, '60': 0 }
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < count.length; index++) {
        const cur = count[index];
        if (cur.age >= 20 && cur.age < 30) {
            age['20'] = age['20'] + cur.count;
        }
        if (cur.age >= 30 && cur.age < 40) {
            age['30'] = age['30'] + cur.count;
        }
        if (cur.age >= 40 && cur.age < 50) {
            age['40'] = age['40'] + cur.count;
        }
        if (cur.age >= 50 && cur.age < 60) {
            age['50'] = age['50'] + cur.count;
        }
        if (cur.age >= 60) {
            age['60'] = age['60'] + cur.count;
        }
    }
    return age;
}

/**
 * [ADMIN] member quantity management
 * @param  {Object}
 * @returns {Promise}
 */
export const memberQuantity = async (query: any) => {
    const fromDate: any = !!query.fromDate && new Date(query.fromDate);
    const toDate: any = !!query.toDate && new Date(query.toDate);
    const numInDay = Math.floor((toDate - fromDate) / (24 * 3600 * 1000));
    const total = await Users.count({ where: { createdAt: { [Op.lt]: fromDate }, status: STATUS.ACTIVE } });
    const sums: any[] = [];
    const startDate = fromDate.toISOString().split('T')[0];
    for (let index = 0; index <= numInDay; index++) {
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
 * [ADMIN] member age management
 * @param  {Object}
 * @returns {Promise}
 */
export const memberAge = async (query: any) => {
    const fromDate: any = !!query.fromDate && new Date(query.fromDate);
    const toDate: any = !!query.toDate && new Date(query.toDate);
    const numInDay = Math.floor((toDate - fromDate) / (24 * 3600 * 1000));
    const total = await getAgeTotal(fromDate);
    const sums: any[] = [];
    const startDate = fromDate.toISOString().split('T')[0];
    for (let index = 0; index <= numInDay; index++) {
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
    const s20: any = `SELECT ${sums.join(',')} from users as u where u.status = 1 and u.age >= 20 and u.age < 30;`
    const s30: any = `SELECT ${sums.join(',')} from users as u where u.status = 1 and u.age >= 30 and u.age < 40;`
    const s40: any = `SELECT ${sums.join(',')} from users as u where u.status = 1 and u.age >= 40 and u.age < 50;`
    const s50: any = `SELECT ${sums.join(',')} from users as u where u.status = 1 and u.age >= 50 and u.age < 60;`
    const s60: any = `SELECT ${sums.join(',')} from users as u where u.status = 1 and u.age > 60;`
    const r20 = await Users.sequelize.query(s20, { type: QueryTypes.SELECT });
    const r30 = await Users.sequelize.query(s30, { type: QueryTypes.SELECT });
    const r40 = await Users.sequelize.query(s40, { type: QueryTypes.SELECT });
    const r50 = await Users.sequelize.query(s50, { type: QueryTypes.SELECT });
    const r60 = await Users.sequelize.query(s60, { type: QueryTypes.SELECT });
    const users20: any = r20 && r20[0]
    const users30: any = r30 && r30[0]
    const users40: any = r40 && r40[0]
    const users50: any = r50 && r50[0]
    const users60: any = r60 && r60[0]
    const keys = Object.keys(users20);
    if (keys) {
        const results = keys.map((key: any) => {
            return {
                "20": +total[20] + +users20[key],
                "30": +total[30] + +users30[key],
                "40": +total[40] + +users40[key],
                "50": +total[50] + +users50[key],
                "60": +total[60] + +users60[key],
                date: key
            };
        })
        return Promise.resolve(results);
    }
    return Promise.resolve([]);
}

/**
 * [ADMIN] member gender management
 * @param  {Object}
 * @returns {Promise}
 */
export const memberGender = async (query: any) => {
    const fromDate: any = !!query.fromDate && new Date(query.fromDate);
    const toDate: any = !!query.toDate && new Date(query.toDate);
    const numInDay = Math.floor((toDate - fromDate) / (24 * 3600 * 1000));
    const total = await Users.count({ where: { createdAt: { [Op.lt]: fromDate },  status: STATUS.ACTIVE }, group: ['gender'] });
    const sums: any[] = [];
    const startDate = fromDate.toISOString().split('T')[0];
    for (let index = 0; index <= numInDay; index++) {
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
    const sql: any = `SELECT ${sums.join(',')} from users as u  where u.status = 1 GROUP BY u.gender;`
    const rUsers = await Users.sequelize.query(sql, { type: QueryTypes.SELECT });
    const females: any = rUsers && rUsers[0]
    const males: any = rUsers && rUsers[1]
    const keys = Object.keys(females);
    if (keys) {
        const results = keys.map((key: any) => {
            return {
                value: [
                    {
                        gender: "FEMALE",
                        count: +total[0].count + +females[key]
                    },
                    {
                        gender: "MALE",
                        count: +total[1].count + +males[key]
                    }
                ],
                date: key
            };
        })
        return Promise.resolve(results);
    }
    return Promise.resolve([]);
}

/**
 * [ADMIN] member gender management
 * @param  {Object}
 * @returns {Promise}
 */
export const memberManagement = async (query: any) => {
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const fromDate = !!query.fromDate && new Date(query.fromDate)
    const toDate = !!query.toDate && new Date(query.toDate)
    const order = query?.order === 'DESC' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
    const key = query.key;

    const where = !!key ? {
        createdAt: {
            [Op.and]: {
                [Op.gte]: fromDate.toISOString(),
                [Op.lte]: toDate.toISOString(),
            }
        },
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
        ],
        status: STATUS.ACTIVE,
        role: ROLE_USER.USER,

    } : {
        createdAt: {
            [Op.and]: {
                [Op.gte]: fromDate.toISOString(),
                [Op.lte]: toDate.toISOString(),
            }
        },
        status: STATUS.ACTIVE,
        role: ROLE_USER.USER
    }

    const { count, rows } = await Users.findAndCountAll({
        where,
        offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: order as any,
        include: [
            {
                model: CategoryProfiles,
                include: ['category'],
                as: 'category_profile',
                separate: true
            }
        ],
        distinct: true
    })
    const results = rows.map(item => item.toUserManagement());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ results, metaData });
}


/**
 * [ADMIN] getdetail member
 * @param  {Object}
 * @returns {Promise}
 */
export const getDetailMember = async (query: any) => {
    const { id } = query;
    const member = await Users.findOne({
        where: { id, status: STATUS.ACTIVE }, include: [{
            model: CategoryProfiles,
            include: ['category'],
            as: 'category_profile',
            separate: true
        }, 'avatarUrl']
    });
    if (!member) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    return Promise.resolve(member.toUserManagementDetail());
}

/**
 * [ADMIN] delete member
 * @param  {Object}
 * @returns {Promise}
 */
export const deleteMember = async (query: any) => {
    const { id } = query;
    const member = await Users.findOne({ where: { id, status: STATUS.ACTIVE, role: ROLE_USER.USER } });
    if (!member) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    await Users.update({ status: STATUS.DELETED }, { where: { id, status: STATUS.ACTIVE, role: ROLE_USER.USER } });
    await RABBIT.sendDataToRabbit(JOB_NAME.DELETE_USER, { memberIds: [id] });
    return Promise.resolve({ mesages: "Delete successfully!" });
}

/**
 * [ADMIN] delete members
 * @param  {Object}
 * @returns {Promise}
 */
export const deleteMembers = async (body: any) => {
    const { memberIds } = body;
    await Users.update({ status: STATUS.DELETED }, { where: { id: { [Op.in]: memberIds }, status: STATUS.ACTIVE, role: ROLE_USER.USER } });
    await RABBIT.sendDataToRabbit(JOB_NAME.DELETE_USER, { memberIds });
    return Promise.resolve({ mesages: "Delete successfully!" });
}

/**
 * [ADMIN] search members
 * @param  {Object}
 * @returns {Promise}
 */
export const searchMembers = async (query: any) => {
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;
    const order = query?.order === 'DESC' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
    const key = query.key;

    const { count, rows } = await Users.findAndCountAll({
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
            ],
            status: STATUS.ACTIVE,
            role: ROLE_USER.USER
        }, offset: offset > 0 ? (offset - 1) * limit : offset, limit: +limit, order: order as any,
        include: [{
            model: CategoryProfiles,
            include: ['category'],
            as: 'category_profile',
            separate: true
        }],
        distinct: true
    })
    const results = rows.map(item => item.toUserManagement());
    const metaData = await pagination(count, +offset, limit, rows.length);
    return Promise.resolve({ results, metaData });
}




