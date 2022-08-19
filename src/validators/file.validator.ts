import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";

const validatorDeleteFileSchema = Joi.object({
    id: Joi.number().required(),
});

export const validatorDeleteFile = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteFileSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorDeleteFilesSchema = Joi.object({
    deleteIds: Joi.array().items(Joi.number()).min(1).required()
});

export const validatorDeleteFiles = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteFilesSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}