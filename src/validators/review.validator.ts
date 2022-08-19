import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorGeReviewsOfProductSchema = Joi.object({
    productId: Joi.number().required(),
    page: Joi.number().required(),
    size: Joi.number().required()
});

export const validatorGeReviewsOfProduct = (req: any, res: any, next: any) => {
    const validateUser = validatorGeReviewsOfProductSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetALLReviewsOfProductSchema = Joi.object({
    productId: Joi.number().required()
});

export const validatorGetALLReviewsOfProduct = (req: any, res: any, next: any) => {
    const validateUser = validatorGetALLReviewsOfProductSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorCreateReviewSchema = Joi.object({
    productId: Joi.number().required(),
    content: Joi.string().required(),
    image: Joi.optional()
});

export const validatorCreateReview = (req: any, res: any, next: any) => {
    const validateUser = validatorCreateReviewSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteReviewSchema = Joi.object({
    id: Joi.number().required(),
});

export const validatorDeleteReview = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteReviewSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetDetailReviewSchema = Joi.object({
    id: Joi.number().required(),
});

export const validatorGetDetailReview = (req: any, res: any, next: any) => {
    const validateUser = validatorGetDetailReviewSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteReviewsSchema = Joi.object({
    reviewIds: Joi.array().items(Joi.number()).min(1).max(5).required(),
});

export const validatorDeleteReviews = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteReviewsSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGeReviewsOfProductAdminSchema = Joi.object({
    productId: Joi.number().allow(null, ''),
    fromDate: Joi.date().allow(null, ''),
    toDate: Joi.date().allow(null, ''),
    key: Joi.allow(null, ''),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC").required(),
});

export const validatorGeReviewsOfProductAdmin = (req: any, res: any, next: any) => {
    const validateUser = validatorGeReviewsOfProductAdminSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}