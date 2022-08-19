import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorGetMyLikeListSchema = Joi.object({
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
});

export const validatorGetMyLikeList = (req: any, res: any, next: any) => {
    const validateUser = validatorGetMyLikeListSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetMyReviewListSchema = Joi.object({
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
});

export const validatorGetMyReviewList = (req: any, res: any, next: any) => {
    const validateUser = validatorGetMyReviewListSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorEditProfileSchema = Joi.object({
    avatar: Joi.number(),
    nickname: Joi.string(),
    name: Joi.string(),
    newPassword: Joi.string(),
    phoneNumber: Joi.string(),
    categories: Joi.array().items(Joi.number()),
    gender: Joi.string(),
    age: Joi.number(),
});

export const validatorEditProfile = (req: any, res: any, next: any) => {
    const validateUser = validatorEditProfileSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorUpdateNotificationSchema = Joi.object({
    notification: Joi.number().integer().valid(0, 1).required(),
});

export const validatorUpdateNotification = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateNotificationSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}