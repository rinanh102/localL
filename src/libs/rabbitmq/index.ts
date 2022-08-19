import RABBIT from "./init";
import { JOB_NAME } from "../../utils/const";
import { logger } from "../../libs/logs";
import consumeData from "./channel"

function _sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createQueue() {
    try {
        await _sleep(5000);
        await RABBIT.initChannel();

        RABBIT.initQueue(JOB_NAME.SAVE_IMAGE_GIFT, false);
        RABBIT.initQueue(JOB_NAME.SAVE_IMAGE_GIFT_EDIT, false);
        RABBIT.initQueue(JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_EDIT, false);
        RABBIT.initQueue(JOB_NAME.SAVE_IMAGE_GIFT_DELETE, false);
        RABBIT.initQueue(JOB_NAME.SAVE_IMAGE_GIFT_DELETES, false);
        RABBIT.initQueue(JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETE, false);
        RABBIT.initQueue(JOB_NAME.SAVE_PRODUCT_BUNDLE_RELATION_DELETES, false);
        RABBIT.initQueue(JOB_NAME.SAVE_PRODUCT_CREATE, false);
        RABBIT.initQueue(JOB_NAME.SAVE_PRODUCT_DELETE, false);
        RABBIT.initQueue(JOB_NAME.SAVE_PRODUCT_EDIT, false);
        RABBIT.initQueue(JOB_NAME.DELETE_USER, false);
        RABBIT.initQueue(JOB_NAME.SAVE_USER_EDIT, false);
        RABBIT.initQueue(JOB_NAME.DELETE_RELATION_REVIEW, false);
        RABBIT.initQueue(JOB_NAME.DELETE_RELATION_REVIEWS, false);
        RABBIT.initQueue(JOB_NAME.SUBCRIBE_TOKEN, false);
        RABBIT.initQueue(JOB_NAME.UNSUBCRIBE_TOKEN, false);
        RABBIT.initQueue(JOB_NAME.PUSH_NOTIFICATION, false);
        RABBIT.initQueue(JOB_NAME.DELETE_SNACKS, false);

        logger.info("AMPQ queue is running...");
        return Promise.resolve(true);
    } catch (error) {
        logger.error("AMPQ: createQueue initChannel error:", error);
        return Promise.reject(false);
    }
}

function createWorkers() {
    RABBIT.initChannel()
        .then(() => {
            consumeData();
            logger.info("AMPQ worker is running...");
        })
        .catch((error) => {
            logger.error("AMPQ: createWorkers initChannel error:", error);
        });
}


(async () => {
    try {
        await createQueue();
        setTimeout(() => { createWorkers(); }, 1000);
    }
    catch (err: any) {
        createWorkers();
        logger.log("Error init rabbit : ", err);
    }
})();

