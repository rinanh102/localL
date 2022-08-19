import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";

const validatorCreateGiftSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    thumbnail: Joi.number().required(),
    images: Joi.array().items(Joi.number()).min(1).max(5).required(),
    products: Joi.array().items(Joi.object({
        productId: Joi.number(),
        quantity: Joi.number()
    })).min(2).required(),
    alcoholics: Joi.array().items(Joi.number()).min(1).max(5).required(),
    url: Joi.string()
});

export const validatorCreateGift = (req: any, res: any, next: any) => {
    const validateUser = validatorCreateGiftSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorEditGiftSchema = Joi.object({
    giftId: Joi.number().required(),
    title: Joi.string(),
    price: Joi.number(),
    discount: Joi.number(),
    thumbnail: Joi.number(),
    images: Joi.array().items(Joi.number()).min(1).max(5),
    products: Joi.array().items(Joi.object({
        productId: Joi.number(),
        quantity: Joi.number()
    })).min(2),
    alcoholics: Joi.array().items(Joi.number()).min(1).max(5),
    url: Joi.string()
});

export const validatorEditGift = (req: any, res: any, next: any) => {
    const validateUser = validatorEditGiftSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteGiftSchema = Joi.object({
    id: Joi.number().required(),
});

export const validatorDeleteGift = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteGiftSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteGiftsSchema = Joi.object({
    giftIds: Joi.array().items(Joi.number()).min(1).max(5).required(),
});

export const validatorDeleteGifts = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteGiftsSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetGiftSchema = Joi.object({
    id: Joi.number().required(),
});

export const validatorGetGift = (req: any, res: any, next: any) => {
    const validateUser = validatorGetGiftSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetGiftsSchema = Joi.object({
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
});

export const validatorGetGifts = (req: any, res: any, next: any) => {
    const validateUser = validatorGetGiftsSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetListGiftSchema = Joi.object({
    name: Joi.allow(null, ''),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC").required(),
});


export const validatorGetListGift = (req: any, res: any, next: any) => {
    const validateUser = validatorGetListGiftSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorUpdateTotalClickSchema = Joi.object({
    id: Joi.string().required()
});

export const validatorUpdateTotalClick = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateTotalClickSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorSearchProductViaNameSchema = Joi.object({
    name: Joi.allow(null, ''),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC").required(),
});

export const validatorSearchProductViaName = (req: any, res: any, next: any) => {
    const validateUser = validatorSearchProductViaNameSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}