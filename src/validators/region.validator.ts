import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorGetDistrictsOfRegionSchema = Joi.object({
    regionId: Joi.number().required(),
});

export const validatorGetDistrictsOfRegion = (req: any, res: any, next: any) => {
    const validateUser = validatorGetDistrictsOfRegionSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}