import Joi from "joi";
import { BannerType } from "../utils/const";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorGetBannerSchema = Joi.object({
    type: Joi.string().required().valid(BannerType.PROMOTION, BannerType.SEARCH),
});

export const validatorGetBanner = (req: any, res: any, next: any) => {
    const validateUser = validatorGetBannerSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

//
const validatorUpdateBannerSchema = Joi.object({
    banners: Joi.array().items(Joi.object({
        id: Joi.number().required(),
        image: Joi.number().required(),
        url: Joi.string().required()
    })).required()
});

export const validatorUpdateBanner = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateBannerSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}