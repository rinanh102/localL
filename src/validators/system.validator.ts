import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorGetSettingFileSchema = Joi.object({
    type: Joi.string().required().valid('MAIN', 'POLICY', 'TERM', 'SERVICE', 'LOCATION'),
});

export const validatorGetSettingFile = (req: any, res: any, next: any) => {
    const validateUser = validatorGetSettingFileSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorUpdateSettingFileSchema = Joi.object({
    mainText: Joi.string(),
    policy: Joi.string(),
    termOfService: Joi.string(),
    locationPolicy: Joi.string(),
    kakaoUrl: Joi.string()
});

export const validatorUpdateSettingFile = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateSettingFileSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorUpdateOnboardingFileSchema = Joi.object({
    onboardings: Joi.array().items(Joi.object({
        id: Joi.number().required(),
        image: Joi.number().required()
    })).required()
});

export const validatorUpdateOnboardingFile = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateOnboardingFileSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}