import * as  saveImageGift from "./workers/saveImageGift.workers";
import * as saveProductBundleRelation from "./workers/saveProductBundleRelation.workers";
import * as productManagement from "./workers/productManagement.workers";
import * as userManagement from "./workers/deleteUser.workers";
import * as reviewRelation from "./workers/deleteReview.wokers";
import * as fcmService from "./workers/pushNotification.workers";

const consumeData = () => {
    saveImageGift.saveImageGiftCreate(),
    saveImageGift.saveImageGiftEdit(),
    saveImageGift.saveImageGiftDelete(),
    saveImageGift.saveImageGiftDeletes(),
    saveProductBundleRelation.saveProductBundleRelationEdit(),
    saveProductBundleRelation.saveProductBundleRelationDelete(),
    saveProductBundleRelation.saveProductBundleRelationDeletes(),
    productManagement.saveProductCreate(),
    productManagement.saveProductEdit(),
    productManagement.saveProductDelete(),
    userManagement.deleteUser(),
    userManagement.saveUserEdit(),
    reviewRelation.deleteRelationReview(),
    reviewRelation.deleteRelationReviews(),
    fcmService.subcribeToken(),
    fcmService.unSubcribeToken(),
    fcmService.pushNotification(),
    reviewRelation.deleteSnacks()
}
export default consumeData