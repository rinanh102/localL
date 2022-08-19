import Files from "../../../models/files.model";
import { logger } from "../../../libs/logs";
import { JOB_NAME, STATUS } from "../../../utils/const";
import RABBIT from "../init";
import Sequelize from "sequelize";
import KeyWordProducts from "../../../models/keywordProducts.model";
import TasteEvaluations from "../../../models/tasteEvaluation.model";
import SnackProducts from "../../../models/snacksProducts.model";
import ProductsCategories from "../../../models/productsCategories.model";
import ProductsBundles from "../../../models/productsBundles.model";

const { Op } = Sequelize;

export async function saveProductCreate() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_PRODUCT_CREATE,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { thumbnail, images, product } = message;
                const productId = product.id;
                // save file
                // tslint:disable-next-line: prefer-for-of
                for (let index = 0; index < images.length; index++) {
                    const id = images[index];
                    await Files.update({ productId, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }
                for (let index = 0; index < thumbnail.length; index++) {
                    const id = thumbnail[index];
                    await Files.update({ productId, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }
                logger.info(`${JOB_NAME.SAVE_PRODUCT_CREATE}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_PRODUCT_CREATE}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveProductEdit() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_PRODUCT_EDIT,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { thumbnail, images, productId, keyword_product, taste_evaluations, snack_product, product_categories } = message;
                for (let index = 0; index < images.length; index++) {
                    const id = images[index];
                    await Files.update({ productId, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }
                for (let index = 0; index < thumbnail.length; index++) {
                    const id = thumbnail[index];
                    await Files.update({ productId, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }                // save relation
                if (!!productId) {
                    await Promise.all([
                        KeyWordProducts.destroy({ where: { productId } }),
                        TasteEvaluations.destroy({ where: { productId } }),
                        SnackProducts.destroy({ where: { productId } }),
                        ProductsCategories.destroy({ where: { productId } })
                    ]);

                    await Promise.all([
                        KeyWordProducts.bulkCreate(keyword_product),
                        TasteEvaluations.bulkCreate(taste_evaluations),
                        SnackProducts.bulkCreate(snack_product),
                        ProductsCategories.bulkCreate(product_categories)
                    ]);
                }

                logger.info(`${JOB_NAME.SAVE_PRODUCT_EDIT}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_PRODUCT_EDIT}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveProductDelete() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_PRODUCT_DELETE,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { productId } = message;
                await Promise.all([
                    Files.update({ status: STATUS.DELETED }, { where: { productId } }),
                    KeyWordProducts.destroy({ where: { productId } }),
                    TasteEvaluations.destroy({ where: { productId } }),
                    SnackProducts.destroy({ where: { productId } }),
                    ProductsCategories.destroy({ where: { productId } }),
                    ProductsBundles.destroy({ where: { productId } })
                ]);
                logger.info(`${JOB_NAME.SAVE_PRODUCT_DELETE}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_PRODUCT_DELETE}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}
