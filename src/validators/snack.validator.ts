import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";

const validatorGetDetailSnackSchema = Joi.object({
    id: Joi.number().required()
});

export const validatorGetDetailSnack = (req: any, res: any, next: any) => {
    const validateUser = validatorGetDetailSnackSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteSnackSchema = Joi.object({
    id: Joi.number().required()
});

export const validatorDeleteSnack = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteSnackSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteSnacksSchema = Joi.object({
    snackIds: Joi.array().items(Joi.number()).min(1).max(5).required(),
});

export const validatorDeleteSnacks = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteSnacksSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorCreateSnackSchema = Joi.object({
    image: Joi.number().required(),
    name: Joi.string().required(),
});

export const validatorCreateSnack = (req: any, res: any, next: any) => {
    const validateUser = validatorCreateSnackSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorUpdateSnackSchema = Joi.object({
    snackId: Joi.number().required(),
    image: Joi.number().required(),
    name: Joi.string().required(),
});

export const validatorUpdateSnack = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateSnackSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetListSnackSchema = Joi.object({
    limit: Joi.number().integer().min(1),
    offset: Joi.number().integer().min(1),
    order: Joi.string().valid("ASC", "DESC")
});

export const validatorGetListSnack = (req: any, res: any, next: any) => {
    const validateUser = validatorGetListSnackSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}