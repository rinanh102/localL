import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import * as MyPageController from "../../controllers/mypage.controller";
import { validatorGetMyLikeList, validatorGetMyReviewList, validatorEditProfile, validatorUpdateNotification } from "../../validators/mypage.validator";

export default (mypageRouter: Router): void => {
    mypageRouter.route("/my-page/my-likes")
        .get(xhrRequired, AuthenticationClient, validatorGetMyLikeList, MyPageController.getMyLikeList)
    mypageRouter.route("/my-page/my-reviews")
        .get(xhrRequired, AuthenticationClient, validatorGetMyReviewList, MyPageController.getMyReviewList)
    mypageRouter.route("/my-page/my-detail")
        .get(xhrRequired, AuthenticationClient, MyPageController.getMyDetail)
    mypageRouter.route("/my-page/my-detail/edit")
        .put(xhrRequired, AuthenticationClient, validatorEditProfile, MyPageController.editProfile)
    mypageRouter.route("/my-page/notification/edit")
        .put(xhrRequired, AuthenticationClient, validatorUpdateNotification, MyPageController.updateNotification)
}