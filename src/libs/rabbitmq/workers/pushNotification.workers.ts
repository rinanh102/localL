import { logger } from "../../../libs/logs";
import { JOB_NAME, NOTIFICATION, NOTIFICATION_TOPIC, STATUS } from "../../../utils/const";
import RABBIT from "../init";
import firebaseAdmin from "../../firebase/index";
import UserSettings from "../../../models/userSettings.model";
import DeviceSessions from "../../../models/deviceSession.model";

export async function subcribeToken() {
    RABBIT.consumeData(
        JOB_NAME.SUBCRIBE_TOKEN,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { deviceTokens } = message;
                const subscribe = await firebaseAdmin.messaging().subscribeToTopic(deviceTokens, NOTIFICATION_TOPIC.BANNER);
                if (subscribe) {
                    channel.ack(msg);
                    logger.info(`${JOB_NAME.SUBCRIBE_TOKEN}----success`);
                    return true;
                }
                channel.nack(msg);
                logger.info(`${JOB_NAME.SUBCRIBE_TOKEN}----error`);
                return false;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.SUBCRIBE_TOKEN}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function unSubcribeToken() {
    RABBIT.consumeData(
        JOB_NAME.UNSUBCRIBE_TOKEN,
        async (msg: any, channel: any) => {
            try {
                const message = JSON.parse(msg.content.toString());
                const { deviceTokens } = message;
                const subscribe = await firebaseAdmin.messaging().unsubscribeFromTopic(deviceTokens, NOTIFICATION_TOPIC.BANNER);
                if (subscribe) {
                    channel.ack(msg);
                    logger.info(`${JOB_NAME.UNSUBCRIBE_TOKEN}----success`);
                    return true;
                }
                channel.nack(msg);
                logger.info(`${JOB_NAME.UNSUBCRIBE_TOKEN}----error`);
                return false;
            } catch (error) {
                logger.error(error);
                logger.info(`${JOB_NAME.UNSUBCRIBE_TOKEN}----error`);
                channel.nack(msg);
                return false;
            }
        }
    );
}

export async function pushNotification() {
    RABBIT.consumeData(
        JOB_NAME.PUSH_NOTIFICATION,
        async (msg: any, channel: any) => {
            try {
                const tokens = await UserSettings.findAll({
                    where: { notification: NOTIFICATION.ON, status: STATUS.ACTIVE }, include: [
                        {
                            model: DeviceSessions,
                            as: 'tokens',
                            separate: true
                        }
                    ]
                });
                const results = tokens.map((item: any) => item.getTokens());
                const deviceTokens = results.reduce((r: any, c: any) => [...r, ...c.tokens], []);

                const notification = {
                    topic: NOTIFICATION_TOPIC.BANNER,
                    data: {},
                    notification: {
                        title: '알림',
                        body: '새로운 이벤트가 등록되었습니다. 자세한 내용은 앱에서 확인하세요.',
                        imageUrl: 'https://d22x6xalfzwhud.cloudfront.net/ICONS/logo.png'
                    },
                    tokens: deviceTokens
                };
                await firebaseAdmin.messaging().sendMulticast(notification);
                channel.ack(msg);
                logger.info(`${JOB_NAME.PUSH_NOTIFICATION}----success`);
                return true;
            } catch (error) {
                logger.error(error);
                channel.nack(msg);
                logger.info(`${JOB_NAME.PUSH_NOTIFICATION}----error`);
                return false;
            }
        }
    );
}