import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";

const validatorCreateKeywordSchema = Joi.object({
    keyword: Joi.string().required()
});

export const validatorCreateKeyword = (req: any, res: any, next: any) => {
    const validateUser = validatorCreateKeywordSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorUpdateKeywordSchema = Joi.object({
    keywordId: Joi.number().required(),
    hightlight: Joi.boolean().required()
});

export const validatorUpdateKeyword = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateKeywordSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteKeywordSchema = Joi.object({
    id: Joi.number().required(),
});

export const validatorDeleteKeyword = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteKeywordSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}