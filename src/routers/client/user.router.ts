import { Router } from 'express';

import { AuthenticationClient, xhrRequired } from '../../utils/common';
import * as UserController from "../../controllers/user.controller";
import {
    validatorLoginWithSocial,
    validatorVerifySignUpWithEmail,
    validatorVeriFyNickname,
    validatorVerifyEmail,
    validatorVerifyPhoneNumber,
    validatorVerifyCIvalue,
    validatorResetPassword,
    validatorRenewAccessToken,
    validatorLoginWithEmail,
    validatorgetCertifications,
    validatorChangePassword,
    validatorLoginWithCI,
    validatorLoginWithCIEmail
} from "../../validators/user.validator";

export default (userRouter: Router): void => {
    userRouter.route("/user/login")
        .post(xhrRequired, validatorLoginWithEmail, UserController.loginWithEmail);

    userRouter.route("/user/verify-profile")
        .post(xhrRequired, validatorVerifySignUpWithEmail, UserController.verifyProfileSignup);
        
    userRouter.route("/user/signup")
        .post(xhrRequired, validatorLoginWithCIEmail, UserController.loginWithCIEmail);

    userRouter.route("/user/verify-nickname")
        .post(xhrRequired, validatorVeriFyNickname, UserController.verifyNickname);

    userRouter.route("/user/verify-email")
        .post(xhrRequired, validatorVerifyEmail, UserController.verifyEmail);

    userRouter.route("/user/verify-phone-number")
        .post(xhrRequired, validatorVerifyPhoneNumber, UserController.verifyPhoneNumber);

    userRouter.route("/user/self-certification")
        .post(xhrRequired, validatorVerifyCIvalue, UserController.verifyCIvalue);

    userRouter.route("/user/reset-password")
        .put(xhrRequired, validatorResetPassword, UserController.resetPasswordWithEmail);

    userRouter.route("/user/change-password")
        .put(xhrRequired, AuthenticationClient, validatorChangePassword, UserController.changePassword);

    userRouter.route("/user/renew-token")
        .post(xhrRequired, validatorRenewAccessToken, UserController.renewAccessToken);

    userRouter.route("/user/logout")
        .get(xhrRequired, AuthenticationClient, UserController.logout);

    userRouter.route("/user/get-certifications")
        .post(xhrRequired, validatorgetCertifications, UserController.getCertifications);

    userRouter.route("/user/login-social")
        .post(xhrRequired, validatorLoginWithSocial, UserController.loginWithSocial);

    userRouter.route("/user/login-CI-social")
        .post(xhrRequired, validatorLoginWithCI, UserController.loginWithCI);
}