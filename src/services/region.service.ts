import { STATUS } from "../utils/const";
import Regions from "../models/regions.model";

/**
 * [APP] get regions
 * @param  {Object}
 * @returns {Promise}
 */
export const getRegions = async () => {
    const regions = await Regions.findAll({ where: {parentId: null, status: STATUS.ACTIVE } });
    const result = regions.map(data => data.toDataRegion())
    return Promise.resolve(result);
};

/**
 * [APP] get district
 * @param  {Object}
 * @returns {Promise}
 */
 export const getDistrictsOfRegion = async (query: any) => {
    const regionId = query?.regionId;
    const regions = await Regions.findAll({ where: { parentId: regionId, status: STATUS.ACTIVE } });
    const result = regions.map(data => data.toDataDistrict())
    return Promise.resolve(result);
};

/**
 * [ADMIN] get cities
 * @param  {Object}
 * @returns {Promise}
 */
 export const getCities = async () => {
    const regions = await Regions.findAll({ where: { parentId: null, status: STATUS.ACTIVE } });
    const result = regions.map(data => data.toDataRegion())
    return Promise.resolve(result);
};

/**
 * [ADMIN] get districts
 * @param  {Object}
 * @returns {Promise}
 */
 export const getDistricts = async (query: any) => {
    const regionId = query?.regionId;
    const regions = await Regions.findAll({ where: { parentId: regionId, status: STATUS.ACTIVE } });
    const result = regions.map(data => data.toDataRegion())
    return Promise.resolve(result);
};
