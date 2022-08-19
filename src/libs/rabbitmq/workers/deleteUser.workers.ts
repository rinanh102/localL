import Files from "../../../models/files.model";
import { logger } from "../../../libs/logs";
import { FileType, JOB_NAME, STATUS } from "../../../utils/const";
import RABBIT from "../init";
import Sequelize from "sequelize";
import UserSettings from "../../../models/userSettings.model";
import SearchHistories from "../../../models/searchHistories.model";
import ReviewLikes from "../../../models/reviewsLikes.model";
import Reviews from "../../../models/reviews.model";
import ProductLikes from "../../../models/productsLikes.model";
import CategoryProfiles from "../../../models/categoriesProfile.model";
const { Op } = Sequelize;

export async function deleteUser() {
    RABBIT.consumeData(
        JOB_NAME.DELETE_USER,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { memberIds } = message;
                await Promise.all([
                    UserSettings.update({ status: STATUS.DELETED }, { where: { userId: { [Op.in]: memberIds }, status: STATUS.ACTIVE } }),
                    SearchHistories.destroy({ where: { userId: { [Op.in]: memberIds }, status: STATUS.ACTIVE } }),
                    ReviewLikes.destroy({ where: { userId: { [Op.in]: memberIds }, status: STATUS.ACTIVE } }),
                    Reviews.update({ status: STATUS.DELETED }, { where: { userId: { [Op.in]: memberIds }, status: STATUS.ACTIVE } }),
                    ProductLikes.destroy({ where: { userId: { [Op.in]: memberIds }, status: STATUS.ACTIVE } }),
                    CategoryProfiles.destroy({ where: { userId: { [Op.in]: memberIds }, status: STATUS.ACTIVE } }),
                    Files.update({ status: STATUS.DELETED }, { where: { ownerId: { [Op.in]: memberIds }, status: STATUS.ACTIVE, type: FileType.COMMENTS } }),
                ]);
                logger.info(`${JOB_NAME.DELETE_USER}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.DELETE_USER}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function saveUserEdit() {
    RABBIT.consumeData(
        JOB_NAME.SAVE_USER_EDIT,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { userId, categories_profile } = message;
                // save relation
                if (!!userId && !!categories_profile) {
                    await CategoryProfiles.destroy({ where: { userId } })
                    await CategoryProfiles.bulkCreate(categories_profile)
                }
                logger.info(`${JOB_NAME.SAVE_USER_EDIT}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SAVE_USER_EDIT}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}