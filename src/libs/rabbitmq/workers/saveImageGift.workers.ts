import Files from "../../../models/files.model";
import { logger } from "../../../libs/logs";
import { JOB_NAME, STATUS } from "../../../utils/const";
import RABBIT from "../init";
import Sequelize from "sequelize";
const { Op } = Sequelize;

export async function saveImageGiftCreate() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_IMAGE_GIFT,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { images, alcoholics, thumbnail, giftId } = message;
                for (let index = 0; index < images.length; index++) {
                    const id = images[index];
                    await Files.update({ bundleId: giftId, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }
                for (let index = 0; index < alcoholics.length; index++) {
                    const id = alcoholics[index];
                    await Files.update({ bundleId: giftId, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }
                await Files.update({ bundleId: giftId, order: 0 }, { where: { id: thumbnail, status: STATUS.ACTIVE, productId: null, bundleId: null } });
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveImageGiftEdit() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_IMAGE_GIFT_EDIT,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { images, alcoholics, thumbnail, gift } = message;
                for (let index = 0; index < images.length; index++) {
                    const id = images[index];
                    await Files.update({ bundleId: gift.id, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }
                for (let index = 0; index < alcoholics.length; index++) {
                    const id = alcoholics[index];
                    await Files.update({ bundleId: gift.id, order: index + 1 }, { where: { id, status: STATUS.ACTIVE } });
                }
                await Files.update({ bundleId: gift.id, order: 0 }, { where: { id: thumbnail, status: STATUS.ACTIVE, productId: null, bundleId: null } });
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT_EDIT}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT_EDIT}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveImageGiftDelete() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_IMAGE_GIFT_DELETE,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { gift } = message;
                await Files.update({ status: STATUS.DELETED }, { where: { bundleId: gift.id, status: STATUS.ACTIVE } })
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT_DELETE}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT_DELETE}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveImageGiftDeletes() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_IMAGE_GIFT_DELETES,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { giftIds } = message;
                await Files.update({ status: STATUS.DELETED }, { where: { bundleId: { [Op.in]: giftIds }, status: STATUS.ACTIVE } })
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT_DELETES}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_IMAGE_GIFT_DELETES}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}
