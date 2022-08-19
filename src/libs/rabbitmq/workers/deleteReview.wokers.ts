import Files from "../../../models/files.model";
import { logger } from "../../../libs/logs";
import { FileType, JOB_NAME, STATUS } from "../../../utils/const";
import RABBIT from "../init";
import ReviewLikes from "../../../models/reviewsLikes.model";
import UserSettings from "../../../models/userSettings.model";
import Sequelize from "sequelize";
import Reviews from "../../../models/reviews.model";
import Snacks from "../../../models/snacks.model";
const { literal } = Sequelize;

export async function deleteRelationReview() {
    RABBIT.consumeData(
        JOB_NAME.DELETE_RELATION_REVIEW,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { review } = message;
                const { id, userId, image, productId } = review;
                await Promise.all([
                    ReviewLikes.destroy({ where: { reviewId: id, status: STATUS.ACTIVE } }),
                    Files.update({ status: STATUS.DELETED }, { where: { id: image, status: STATUS.ACTIVE, type: FileType.REVIEWS } }),
                ]);
                const checkLike = await Reviews.findOne({ where: { productId, userId, status: STATUS.ACTIVE } });
                if (!checkLike) {
                    await UserSettings.update({ totalReview: literal('totalReview-1') }, { where: { userId, status: STATUS.ACTIVE } })
                }
                logger.info(`${JOB_NAME.DELETE_RELATION_REVIEW}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.DELETE_RELATION_REVIEW}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function deleteRelationReviews() {
    RABBIT.consumeData(
        JOB_NAME.DELETE_RELATION_REVIEWS,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { reviewIds } = message;
                if (reviewIds.length < 6) {
                    // tslint:disable-next-line: prefer-for-of
                    for (let index = 0; index < reviewIds.length; index++) {
                        const reviewId = reviewIds[index];
                        if (!!reviewId) {
                            const review = await Reviews.findOne({ where: { id: reviewId } });
                            const { userId, image, productId } = review;
                            await Files.update({ status: STATUS.DELETED }, { where: { id: image, status: STATUS.ACTIVE, type: FileType.REVIEWS } });
                            const checkLike = await Reviews.findOne({ where: { productId, userId, status: STATUS.ACTIVE } });
                            if (!checkLike) {
                                await UserSettings.update({ totalReview: literal('totalReview-1') }, { where: { userId, status: STATUS.ACTIVE } })
                            }
                        }
                    }
                }
                logger.info(`${JOB_NAME.DELETE_RELATION_REVIEWS}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.DELETE_RELATION_REVIEWS}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function deleteSnacks() {
    RABBIT.consumeData(
        JOB_NAME.DELETE_SNACKS,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { snackIds } = message;
                if (snackIds.length < 6) {
                    // tslint:disable-next-line: prefer-for-of
                    for (let index = 0; index < snackIds.length; index++) {
                        const snackId = snackIds[index];
                        if (!!snackId) {
                            const snack = await Snacks.findOne({ where: { id: snackId } });
                            const { image } = snack;
                            await Files.update({ status: STATUS.DELETED }, { where: { id: image, status: STATUS.ACTIVE, type: FileType.ICONS } });
                        }
                    }
                }
                logger.info(`${JOB_NAME.DELETE_SNACKS}----success`);
                channel.ack(msg);
                return true;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.DELETE_SNACKS}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}