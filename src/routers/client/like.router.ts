import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import * as LikeController from "../../controllers/like.controller";
import { validatorupdateProductLike, validatorupdateupdateCategoryLike, validatorupdateupdateReviewLike } from "../../validators/like.validator";

export default (likeRouter: Router): void => {
    likeRouter.route("/like-product")
        .get(xhrRequired, AuthenticationClient, validatorupdateProductLike, LikeController.updateProductLike)
    likeRouter.route("/like-review")
        .get(xhrRequired, AuthenticationClient, validatorupdateupdateReviewLike, LikeController.updateReviewLike)
    likeRouter.route("/like-category")
        .get(xhrRequired, AuthenticationClient, validatorupdateupdateCategoryLike, LikeController.updateCategoryLike)
}

