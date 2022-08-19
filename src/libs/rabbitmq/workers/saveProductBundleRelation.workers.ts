import ProductsBundles from "../../../models/productsBundles.model";
import { logger } from "../../../libs/logs";
import { JOB_NAME, STATUS } from "../../../utils/const";
import RABBIT from "../init";
import Sequelize from "sequelize";
const { Op } = Sequelize;

export async function saveProductBundleRelationEdit() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_EDIT,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { products, gift } = message;
                const productBundles = products.map((product: any) => {
                    return {
                        productId: product.productId,
                        bundleId: gift.id,
                        quantity: product.quantity
                    }
                });
                if (!!productBundles.length) {
                    await ProductsBundles.destroy({ where: { bundleId: gift.id, status: STATUS.ACTIVE } });
                    await ProductsBundles.bulkCreate(productBundles);
                }
                logger.info(`${JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_EDIT}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.info(`${JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_EDIT}----success`);
                logger.error(error);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveProductBundleRelationDelete() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETE,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { gift } = message;
                await ProductsBundles.destroy({ where: { bundleId: gift.id, status: STATUS.ACTIVE } })
                logger.info(`${JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETE}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.info(`${JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETE}----success`);
                logger.error(error);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveProductBundleRelationDeletes() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETES,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { giftIds } = message;
                await ProductsBundles.destroy({ where: { bundleId: { [Op.in]: giftIds }, status: STATUS.ACTIVE } })
                logger.info(`${JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETES}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.info(`${JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETES}----success`);
                logger.error(error);
                channel.nack(msg);
                return false;
            }
        }
    );
}