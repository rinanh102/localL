import { STATUS } from "../utils/const";
import SystemSettings from "../models/systemSettings.model";

/**
 * [ADMIN] get system setting via type
 * @param  {Object} 
 * @returns {Promise}
 */
export const getSettingSystem = async () => {
    const result = await SystemSettings.findOne({ where: { status: STATUS.ACTIVE }, include: ['logoUrl'] });
    return Promise.resolve(result.toDataSystemSetting());
};

/**
 * [ADMIN] update system setting via type
 * @param  {Object} 
 * @returns {Promise}
 */
export const updateSettingSystem = async (body: any) => {
    const { mainText, policy, termOfService, locationPolicy, kakaoUrl } = body;
    const update = Object.assign({}, { mainText, policy, termOfService, locationPolicy, kakaoUrl });
    await SystemSettings.update(update, { where: { status: STATUS.ACTIVE } });
    return Promise.resolve({ mesages: "Update successfully!" });
}
/**
 * [APP] get kako url
 * @param  {Object} 
 * @returns {Promise}
 */
 export const getKakaoUrl = async () => {
    const title = await SystemSettings.findOne({ where: { status: STATUS.ACTIVE } });
    const result = title.toDataKakaoUrl();
    return Promise.resolve(result);
}