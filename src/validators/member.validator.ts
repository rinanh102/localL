import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorMemberManagementSchema = Joi.object({
    fromDate: Joi.date().required(),
    toDate: Joi.date().required(),
});

export const validatorMemberManagement = (req: any, res: any, next: any) => {
    const validateUser = validatorMemberManagementSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetMemberSchema = Joi.object({
    fromDate: Joi.date().required(),
    toDate: Joi.date().required(),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC").required(),
    key: Joi.string().allow(null, '')
});

export const validatorGetMember = (req: any, res: any, next: any) => {
    const validateUser = validatorGetMemberSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetDetailSchema = Joi.object({
    id: Joi.number().required()
});

export const validatorGetDetail = (req: any, res: any, next: any) => {
    const validateUser = validatorGetDetailSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatoDeleteMemberSchema = Joi.object({
    id: Joi.number().required()
});

export const validatoDeleteMember = (req: any, res: any, next: any) => {
    const validateUser = validatoDeleteMemberSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteMembersSchema = Joi.object({
    memberIds: Joi.array().items(Joi.number()).required()
});

export const validatorDeleteMembers = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteMembersSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorSearchMembersSchema = Joi.object({
    key: Joi.string().required(),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC").required(),
});

export const validatorSearchMembers = (req: any, res: any, next: any) => {
    const validateUser = validatorSearchMembersSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}