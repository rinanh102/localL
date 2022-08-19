import { Router } from 'express';
import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { deleteReview, getReviewsOfProductAdmin, deleteReviews, getDetailReview } from "../../controllers/review.controller";
import { validatorDeleteReview, validatorDeleteReviews, validatorGeReviewsOfProductAdmin, validatorGetDetailReview } from '../../validators/review.validator';

export default (reviewRouter: Router): void => {
    reviewRouter.route("/review/delete")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteReview, deleteReview);
    reviewRouter.route("/review/deletes")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteReviews, deleteReviews);
    reviewRouter.route("/review/getReviews")
        .get(xhrRequired, AuthenticationAdmin, validatorGeReviewsOfProductAdmin, getReviewsOfProductAdmin);
    reviewRouter.route("/review/getDetail")
        .get(xhrRequired, AuthenticationAdmin, validatorGetDetailReview, getDetailReview);
}