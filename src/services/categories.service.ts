import { BannerCategoryType, STATUS } from "../utils/const";
import Categories from "../models/categories.model";
import Sequelize from "sequelize";
const { Op } = Sequelize;
/**
 * [APP] get categories
 * @param  {Object} user
 * @returns {Promise}
 */

export const getCategories = async (query: any) => {
  const { type } = query;
  const categories = await Categories.findAll({
    where: {
      status: STATUS.ACTIVE,
      type: type === "ALL" ? { [Op.ne]: null } : type,
    },
  });
  const result = categories.reduce((r: any, a: any) => {
    const key = (a.type as string).toLowerCase();
    r[key] = r[key] || [];
    r[key].push(a);
    return r;
  }, Object.create(null));
  return Promise.resolve(result);
};
/**
 * [APP] get categories for Tab
 * @param  {Object} user
 * @returns {Promise}
 */

export const getCategoriesFilter = async () => {
  const categories = await Categories.findAll({
    where: {
      status: STATUS.ACTIVE,
      type: [
        BannerCategoryType.CATEGORIES,
        BannerCategoryType.CONCENTRATION,
        BannerCategoryType.PRICE,
      ]
    },
    order: [['order', 'ASC']],

  });
  const categoryData = categories.map((data: any) => data.toCateTabData());
  const result = categoryData.reduce((r: any, a: any) => {
    const key = (a.type as string).toLowerCase();
    r[key] = r[key] || [];
    r[key].push(a);
    return r;
  }, Object.create(null));
  return Promise.resolve(result);
};
/**
 * [APP] get categories for user profile
 * @param  {Object} user
 * @returns {Promise}
 */

 export const getCategoriesUserProfile = async () => {
    const categories = await Categories.findAll({
      where: {
        status: STATUS.ACTIVE,
        type: [
          BannerCategoryType.CATEGORIES,
          BannerCategoryType.CONCENTRATION,
          BannerCategoryType.GENDER,
          BannerCategoryType.AGE
        ],
      },
    });
    const categoryData = categories.map((data: any) => data.toCateTabData());
    const result = categoryData.reduce((r: any, a: any) => {
      const key = (a.type as string).toLowerCase();
      r[key] = r[key] || [];
      r[key].push(a);
      return r;
    }, Object.create(null));
    return Promise.resolve(result);
  };
/**
 * [APP] get categories for select form
 * @param  {Object} user
 * @returns {Promise}
 */

export const getCategoriesSelectForm = async () => {
  const categories = await Categories.findAll({
    where: { status: STATUS.ACTIVE },
    order: [['order', 'ASC']],
  });
  const categoryData = categories.map((data: any) => data.toCateTabData());
  const result = categoryData.reduce((r: any, a: any) => {
    const key = (a.type as string).toLowerCase();
    r[key] = r[key] || [];
    r[key].push(a);
    return r;
  }, Object.create(null));
  return Promise.resolve(result);
};
