import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import * as ReviewController from "../../controllers/review.controller";
import { validatorGeReviewsOfProduct, validatorGetALLReviewsOfProduct, validatorCreateReview } from "../../validators/review.validator";

export default (reviewRouter: Router): void => {
    reviewRouter.route("/reviews-product")
        .get(xhrRequired, AuthenticationClient, validatorGeReviewsOfProduct, ReviewController.getReviewsOfProduct)
    reviewRouter.route("/reviews-product/all")
        .get(xhrRequired, AuthenticationClient, validatorGetALLReviewsOfProduct, ReviewController.getAllReviewsOfProduct)
    reviewRouter.route("/review")
        .post(xhrRequired, AuthenticationClient, validatorCreateReview, ReviewController.createReview)
}
