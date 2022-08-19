import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";

const validatorupdateProductLikeSchema = Joi.object({
    productId: Joi.number().required(),
});

export const validatorupdateProductLike = (req: any, res: any, next: any) => {
    const validateUser = validatorupdateProductLikeSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorupdateupdateReviewLikeSchema = Joi.object({
    reviewId: Joi.number().required(),
});

export const validatorupdateupdateReviewLike = (req: any, res: any, next: any) => {
    const validateUser = validatorupdateupdateReviewLikeSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorupdateupdateCategoryLikeSchema = Joi.object({
    categoryId: Joi.number().required(),
});

export const validatorupdateupdateCategoryLike = (req: any, res: any, next: any) => {
    const validateUser = validatorupdateupdateCategoryLikeSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}