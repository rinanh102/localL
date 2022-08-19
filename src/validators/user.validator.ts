import { NextFunction } from "express";
import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";

const validatorLoginWithEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    deviceToken: Joi.string().required(),
});

export const validatorLoginWithEmail = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorLoginWithEmailSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorLoginWithEmailAdminSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const validatorLoginWithEmailAdmin = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorLoginWithEmailAdminSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorLoginWithSocialSchema = Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
    deviceToken: Joi.string().required()
})

export const validatorLoginWithSocial = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorLoginWithSocialSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorLoginWithCISchema = Joi.object({
    kakaoId: Joi.string(),
    appleId: Joi.string(),
    phoneNumber: Joi.string(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    CI_value: Joi.string().required(),
    deviceToken: Joi.string().required()
})

export const validatorLoginWithCI = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorLoginWithCISchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorVerifySignUpWithEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    nickname: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    phoneNumber: Joi.optional(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
})

export const validatorVerifySignUpWithEmail = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorVerifySignUpWithEmailSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorLoginWithCIEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    nickname: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    phoneNumber: Joi.optional(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    CI_value: Joi.string().required(),
    deviceToken: Joi.string().required()
})

export const validatorLoginWithCIEmail = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorLoginWithCIEmailSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}


const validatorVeriFyNicknameSchema = Joi.object({
    nickname: Joi.string().required()
});

export const validatorVeriFyNickname = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorVeriFyNicknameSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorVerifyEmailSchema = Joi.object({
    email: Joi.string().required()
});

export const validatorVerifyEmail = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorVerifyEmailSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorVerifyPhoneNumberSchema = Joi.object({
    phoneNumber: Joi.string().required()
});

export const validatorVerifyPhoneNumber = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorVerifyPhoneNumberSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorVerifyCIvalueSchema = Joi.object({
    CI_value: Joi.string().required(),
});

export const validatorVerifyCIvalue = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorVerifyCIvalueSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorResetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const validatorResetPassword = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorResetPasswordSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}
const validatorChangePasswordSchema = Joi.object({   
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
});
export const validatorChangePassword = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorChangePasswordSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}
const validatorRenewAccessTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
    deviceToken: Joi.string().required()
});
export const validatorRenewAccessToken = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorRenewAccessTokenSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorgetCertificationsSchema = Joi.object({
    uid: Joi.string().required(),
});
export const validatorgetCertifications = (req: any, res: any, next: NextFunction) => {
    const validateUser = validatorgetCertificationsSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}