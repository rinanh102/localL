import Banners from "../models/banners.model";
import { JOB_NAME, NOTIFICATION, STATUS } from "../utils/const";
import SystemSettings from "../models/systemSettings.model";
import RABBIT from "../libs/rabbitmq/init";
import UserSettings from "../models/userSettings.model";
import DeviceSessions from "../models/deviceSession.model";

/**
 * [APP] get main title
 * @param  {Object} 
 * @returns {Promise}
 */

export const getTitle = async () => {
    const title = await SystemSettings.findOne({ where: { status: STATUS.ACTIVE } });
    const result = title.toDataTitle();
    return Promise.resolve(result);
}

/**
 * [APP] get banners
 * @param
 * @returns {Promise}
 */
export const getBanners = async (query: any) => {
    const { type } = query;
    const banners = await Banners.findAll({
        where: {
            status: STATUS.ACTIVE,
            type
        },
        include: ['imageUrl'],
        limit: 3
    })
    const result = banners.map(data => data.toDataBanner());
    return Promise.resolve(result);
}

/**
 * [ADMIN] get banners admin
 * @param
 * @returns {Promise}
 */
export const getBannerAdmin = async (query: any) => {
    const { type } = query;
    const banners = await Banners.findAll({
        where: {
            status: STATUS.ACTIVE,
            type
        },
        include: ['imageUrl'],
        limit: 3
    })
    const result = banners.map(data => data.toDataBannerAdmin());
    return Promise.resolve(result);
}

/**
 * [ADMIN] update banners admin
 * @param
 * @returns {Promise}
 */
export const updateBannerAdmin = async (query: any, body: any) => {
    const { type } = query;
    const { banners } = body;
    const progress = [];
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < banners.length; index++) {
        const { id, url, image } = banners[index]
        progress.push(Banners.update({ url, image }, { where: { id, type, status: STATUS.ACTIVE } }))
    }
    await Promise.all(progress);
    await RABBIT.sendDataToRabbit(JOB_NAME.PUSH_NOTIFICATION, {});
    return Promise.resolve({ type, banners });
}