import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorGetMemberGraphsFileSchema = Joi.object({
    fromDate: Joi.date().required(),
});

export const validatorGetMemberGraphsFile = (req: any, res: any, next: any) => {
    const validateUser = validatorGetMemberGraphsFileSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorSearchDashBoardSchema = Joi.object({
    key: Joi.string().required(),
});

export const validatorSearchDashBoard = (req: any, res: any, next: any) => {
    const validateUser = validatorSearchDashBoardSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}