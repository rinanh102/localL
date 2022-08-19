import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorGetCateSchema = Joi.object({
    type: Joi.string().required(),
});

export const validatorGetCate = (req: any, res: any, next: any) => {
    const validateUser = validatorGetCateSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}
